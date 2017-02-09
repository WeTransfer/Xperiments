defmodule Xperiments.Assigner.Manager do
  use Supervisor
  require Logger

  def start_link do
    Supervisor.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    children = [
      worker(Xperiments.Assigner.Experiment, [], restart: :transient)
    ]
    supervise(children, strategy: :simple_one_for_one)
  end

  ## API

  @doc "Start an experiment using data from the DB"
  def start_experiment(experiment_info) do
    case Supervisor.start_child(__MODULE__, [experiment_info]) do
      {:ok, pid} -> {:ok, pid}
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

  @doc "Returns a list of pid of all runninng experiments"
  @spec experiments_list() :: List
  def experiments_list do
    Supervisor.which_children(__MODULE__)
    |> Enum.map(fn {_, pid, _, _} -> pid end)
  end
end
