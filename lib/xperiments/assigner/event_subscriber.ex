defmodule Xperiments.Assigner.EventSubscriber do
  use GenServer
  require Logger
  alias Xperiments.Assigner.{Experiment, ExperimentSupervisor}

  def start_link(channel) do
    GenServer.start_link(__MODULE__, channel, name: __MODULE__)
  end

  def init(channel) do
    ref = Xperiments.Endpoint.subscribe(channel)
    {:ok, %{ref: ref}}
  end

  def handle_info(%{event: "stop_experiment", payload: payload}, state) do
    Task.async(fn ->
      Experiment.stop(payload.id)
    end)
    {:noreply, state}
  end

  def handle_info(%{event: "run_experiment", payload: payload}, state) do
    Task.async(fn ->
      Experiment.restart(payload.id)
    end)
    {:noreply, state}
  end

  def handle_info(%{event: "terminate_experiment", payload: payload}, state) do
    Task.async(fn ->
      ExperimentSupervisor.terminate_experiment(payload.id)
    end)
    {:noreply, state}
  end

  def handle_info(%{event: "start_experiment", payload: payload}, state) do
    Task.async(fn ->
      ExperimentSupervisor.start_experiment(payload.experiment_data)
    end)
    {:noreply, state}
  end

  def handle_info(msg, state) do
    Logger.warn(inspect(msg))
    {:noreply, state}
  end
end
