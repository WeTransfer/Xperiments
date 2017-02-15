defmodule Xperiments.Assigner.Supervisor do
  use Supervisor

  @registry_name

  def start_link do
    Supervisor.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init([]) do
    children = [
      supervisor(Registry, [:unique, :registry_experiments]),
      supervisor(Registry, [:unique, :registry_priorities], id: make_ref()),
      supervisor(Xperiments.Assigner.ExperimentSupervisor, []),
      worker(Task, [&Xperiments.Assigner.Loader.load_experiments_from_db/0], restart: :temporary)
    ]

    opts = [strategy: :one_for_one, name: Assigner.Supervisor]
    supervise(children, opts)
  end
end
