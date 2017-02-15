defmodule Xperiments.Assigner.Dispatcher do
  alias Xperiments.Assigner.{ExperimentSupervisor, Experiment}

  def get_suitable_experiments(rules, exps) when exps == %{} do
    assigns =
      ExperimentSupervisor.experiment_pids()
      |> get_new_experiments()
    %{assign: assigns, unassign: []}
  end
  def get_suitable_experiments(rules, assigned_experiments) do
    requested_experiments = check_experiments(assigned_experiments)
    exclusion_pids = Enum.map(requested_experiments.assign, & &1.id) |> get_exclusions_pids()
    new_experiments = get_new_experiments(
      ExperimentSupervisor.experiment_pids() -- exclusion_pids)
    Map.update!(requested_experiments, :assign, & new_experiments ++ &1)
  end

  def get_new_experiments([]), do: []
  def get_new_experiments(pids) do
    do_get_new_experiments(pids, [])
  end
  defp do_get_new_experiments([], result), do: result
  defp do_get_new_experiments([pid | tail], result) do
    variant = Experiment.get_random_variant(pid)
    exclusions_pids =
      Experiment.get_exclusions_list(pid)
      |> ExperimentSupervisor.get_experiment_pids_by_ids
    do_get_new_experiments(tail -- exclusions_pids, [variant | result])
  end

  @doc """
  Returns a list of pids, which should be excluded in this request
  """
  def get_exclusions_pids([]), do: []
  def get_exclusions_pids(experiment_ids) do
    experiment_ids
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
  def check_experiments(exps) when exps == %{}, do: %{assign: [], unassign: []}
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
