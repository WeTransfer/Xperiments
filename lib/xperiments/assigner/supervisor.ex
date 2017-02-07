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
      worker(Xperiments.Assigner.Loader, []),
      worker(Xperiments.Assigner.Dispatcher, [])
    ]

    opts = [strategy: :one_for_one, name: Epxeriments.Supervisor]
    supervise(children, opts)
  end
end
