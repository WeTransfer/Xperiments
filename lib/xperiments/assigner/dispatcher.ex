defmodule Xperiments.Assigner.Dispatcher do
  use GenServer
  alias Xperiments.Assigner.{ExperimentSupervisor, Experiment}

  def start_link do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    {:ok, %{}}
  end

  ## Client API

  def get_suitable_experiments(client_id, rules, assigned_experiments \\ %{}) do
    GenServer.call(__MODULE__, {:get_suitable_experiments, rules, assigned_experiments})
  end

  ## Server

  def handle_call({:get_suitable_experiments, rules, assigned_experiments}, _caller, state) do
    response = do_get_suitable_experiments(rules, assigned_experiments)
    {:reply, response, state}
  end

  def do_get_suitable_experiments(rules, assigned_experiments) do
    requested_experiments = check_experiments(assigned_experiments)
    exclusion_pids = get_exclusions_pids(requested_experiments.assign)
    experiment_pids = ExperimentSupervisor.experiment_pids()
    new_experiments = get_new_experiments(experiment_pids -- exclusion_pids)
    Map.update!(requested_experiments, :assign, & new_experiments ++ &1)
  end

  def get_new_experiments([]), do: []
  def get_new_experiments(pids) do
    pids
    |> Enum.map(&Experiment.get_random_variant/1)
  end

  @doc """
  Returns a list of pids, which should be excluded in this request
  """
  def get_exclusions_pids([]), do: []
  def get_exclusions_pids(experiments) do
    Enum.map(experiments, & &1.id)
    |> Enum.map(&Experiment.get_exclusions_list/1)
    |> List.flatten
    |> ExperimentSupervisor.get_experiment_pids_by_ids
  end

  # TODO: create a better description
  @doc """
  This function iterates the given experiments and check if it still running/paused
  and has a requested variant.
  Returns %{assigned: [experiment_data], unassign: [ids_to_delete]}
  """
  @spec check_experiments(assigned_experiments :: List) :: Map
  def check_experiments(%{}), do: %{assign: [], unassign: []}
  def check_experiments(assigned_experiments) do
    assigned_experiments
    |> Enum.map(fn {eid, var_id} ->
      case Registry.lookup(:registry_experiments, eid) do
        [{pid, _}] ->
          case Experiment.get_experiment_data(pid, var_id) do
            {:ok, experiment} -> {:assign, experiment}
            {:error, eid} -> {:unassign, eid}
          end
        [] ->
          {:unassign, eid}
      end
    end)
    |> Enum.group_by(fn {k, _} -> k end, fn {_, v} -> v end)
  end

end
