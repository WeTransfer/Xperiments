defmodule Xperiments.Assigner.Manager do
  use Supervisor

  @name Xperiments.Assigner.Manager

  def start_link do
    Supervisor.start_link(__MODULE__, :ok, name: @name)
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
    Supervisor.start_child(@name, [experiment_info])
  end

  @doc "Remove an experiment from the supervision tree"
  def terminate_experiment(id) do
    [{pid, _}] = Registry.lookup(:registry_experiments, id)
    Supervisor.terminate_child(@name, pid)
  end

  @doc "Returns a list of pid of all runninng experiments"
  @spec experiments_list() :: List
  def experiments_list do
    Supervisor.which_children(__MODULE__)
    |> Enum.map(fn {_, pid, _, _} -> pid end)
  end
end
