defmodule Xperiments.Assigner.EventSubscriber do
  use GenServer
  require Logger
  alias Xperiments.Assigner.{Experiment, ExperimentSupervisor}

  def start_link(channel) do
    GenServer.start_link(__MODULE__, channel, name: __MODULE__)
  end

  def init(channel) do
    ref = XperimentsWeb.Endpoint.subscribe(channel)
    {:ok, %{ref: ref}, :hibernate}
  end

  def handle_info(%{event: "stop_experiment", payload: payload}, state) do
    Task.start(Experiment, :stop, [payload.id])
    {:noreply, state, :hibernate}
  end

  def handle_info(%{event: "run_experiment", payload: payload}, state) do
    Task.start(Experiment, :restart, [payload.id])
    {:noreply, state, :hibernate}
  end

  def handle_info(%{event: "terminate_experiment", payload: payload}, state) do
    Task.start fn ->
      ExperimentSupervisor.terminate_experiment(payload.id)
      ExperimentSupervisor.experiment_pids
      |> Enum.each(fn epid -> Experiment.remove_exclusion(epid, payload.id) end)
    end
    {:noreply, state, :hibernate}
  end

  def handle_info(%{event: "start_experiment", payload: %{experiment_data: experiment_data}}, state) do
    spawn fn ->
      {:ok, _pid} = ExperimentSupervisor.start_experiment(experiment_data)
      Enum.each(experiment_data.exclusions, fn e -> Experiment.add_exclusion(e, experiment_data.id) end)
    end
    {:noreply, state, :hibernate}
  end

  def handle_info(%{event: "event:impression", payload: payload}, state) do
    variant_id = :binary.copy(payload.var_id)
    Experiment.inc_impression(payload.eid, variant_id)
    {:noreply, state, :hibernate}
  end

  def handle_info(msg, state) do
    Logger.warn(inspect(msg))
    {:noreply, state, :hibernate}
  end
end
