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

  def get_registry_experiments_pid do
    Supervisor.which_children(Xperiments.Assigner.Supervisor)
    |> Enum.filter(fn {id, _, _, _} -> id == Registry end)
    |> List.first
    |> elem(1) # get a Regisry pid from a tuple {id, pid, type, modules}
  end

  def get_registered_experiments do
    Registry.keys(@registry_name, get_registry_experiments_pid())
  end

end
