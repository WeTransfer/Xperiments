defmodule Xperiments.Assigner.ExperimentSupervisor do
  use Supervisor
  require Logger
  alias Xperiments.Assigner.Experiment

  def start_link do
    Supervisor.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    children = [
      worker(Experiment, [], restart: :transient)
    ]
    supervise(children, strategy: :simple_one_for_one)
  end

  ## API

  @doc "Start an experiment using data from the DB"
  def start_experiment(experiment_data) do
    case Supervisor.start_child(__MODULE__, [experiment_data]) do
      {:ok, pid} ->
        Experiment.register_priority(pid)
        Logger.info "Experiment #{experiment_data.name} successfully started"
        {:ok, pid}
      {:error, {:bad_experiment, experiment}} ->
        Logger.error "Given experiment is not started: #{inspect experiment}"
        :error
      err ->
        Logger.error "Can't start an experiment with the reason: #{inspect err}"
        :error
    end
  end

  @doc "Remove an experiment from the supervision tree"
  def terminate_experiment(id) do
    [{pid, _}] = Registry.lookup(:registry_experiments, id)
    Supervisor.terminate_child(__MODULE__, pid)
  end

  @doc "Returns a list of pid of all runninng/stopped experiments"
  @spec experiment_pids() :: List
  def experiment_pids do
    Supervisor.which_children(__MODULE__)
    |> Enum.map(fn {_, pid, _, _} ->
      [{_, priority}] = Registry.lookup(:registry_priorities, pid)
      {pid, priority}
    end)
    |> Enum.sort(fn {_, p1}, {_, p2} -> p1 > p2 end)
    |> Enum.map(fn {pid, _} -> pid end)
  end

  @doc """
  Returns experiment ids by given list of pids
  """
  @spec get_experiment_pids_by_ids(ids :: List) :: List
  def get_experiment_pids_by_ids(ids) do
    List.wrap(ids)
    |> Enum.map(fn id ->
      [{pid, _}] = Registry.lookup(:registry_experiments, id)
      pid
    end)
  end
end
