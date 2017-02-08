defmodule Xperiments.Assigner.Supervisor do
  use Supervisor

  @registry_name :registry_experiments

  def start_link do
    Supervisor.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init([]) do
    children = [
      supervisor(Registry, [:unique, @registry_name]),
      supervisor(Xperiments.Assigner.Manager, []),
      worker(Task, [&Xperiments.Assigner.Loader.load_experiments_from_db/0], restart: :temporary),
      worker(Xperiments.Assigner.Dispatcher, [])
    ]

    opts = [strategy: :one_for_one, name: Assigner.Supervisor]
    supervise(children, opts)
  end
end
