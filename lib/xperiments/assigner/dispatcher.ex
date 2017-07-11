defmodule Xperiments.Assigner.Dispatcher do
  @moduledoc """
  *Manage requests for experiments.*
  Prepare a response, based on a request.
  If new client asks for experiment we check segments and assign it to experiments,
  based on priority, exclude all futher experiments on the way if need it
  """
  alias Xperiments.Assigner.{ExperimentSupervisor, Experiment}

  @doc "Entry point for the module"
  def get_suitable_experiments(segments, nil) do
    assigns =
      ExperimentSupervisor.experiment_pids()
      |> get_new_experiments(segments)
    %{assign: assigns, unassign: []}
  end
  def get_suitable_experiments(segments, assigned_experiments) do
    requested_experiments = check_experiments(assigned_experiments)
    requested_ids         = Enum.map(requested_experiments.assign, & &1.id)
    requested_pids        = ExperimentSupervisor.get_experiment_pids_by_ids(requested_ids)
    exclusion_pids        = get_exclusions_pids(requested_ids)
    pids = (ExperimentSupervisor.experiment_pids() -- exclusion_pids) -- requested_pids
    Map.update!(requested_experiments, :assign, & get_new_experiments(pids, segments) ++ &1)
  end

  def get_new_experiments([], _), do: []
  def get_new_experiments(pids, segments) do
    do_get_new_experiments(pids, [], segments)
  end
  defp do_get_new_experiments([], result, _), do: result
  defp do_get_new_experiments([pid | tail], result, segments) do
    if Experiment.accept_segments?(pid, segments) && Experiment.is_started?(pid) do
      variant = Experiment.get_random_variant(pid)
      exclusions_pids =
        Experiment.get_exclusions_list(pid)
        |> ExperimentSupervisor.get_experiment_pids_by_ids
      do_get_new_experiments(tail -- exclusions_pids, [variant | result], segments)
    else
      do_get_new_experiments(tail, result, segments)
    end
  end

  @doc "Returns a list of pids, which should be excluded in this request"
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
  def check_experiments([]), do: %{assign: [], unassign: []}
  def check_experiments(assigned_experiments) do
    assigned_experiments
    |> Enum.map(fn %{"experiment_id" => eid, "variant_id" => var_id} ->
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
    |> Map.put_new(:unassign, []) # Complete the result, so it always has keys: `unassign` and `assign`
    |> Map.put_new(:assign, [])
  end
end
