defmodule Xperiments.Exclusion do
  @moduledoc """
  Join model for the many to may experiments to itself.
  Uses to store mutual exclusions.
  """
  use Xperiments.Web, :model
  alias Xperiments.{Experiment, Repo}

  @foreign_key_type :binary_id
  @primary_key false

  schema "experiments_exclusions" do
    belongs_to :experiment_a, Experiment
    belongs_to :experiment_b, Experiment
  end

  @doc """
  Returning all excusions for a given experiment
  """
  def for_experiment(id) do
    from(e in Experiment,
      where: e.id in fragment("SELECT experiment_b_id FROM experiments_exclusions WHERE experiment_a_id = ?", type(^id, :binary_id)),
      or_where: e.id in fragment("SELECT experiment_a_id FROM experiments_exclusions WHERE experiment_b_id = ?", type(^id, :binary_id)),
      where: not(e.state in ["terminated", "deleted"]),
      select: e.id)
    |> Repo.all
  end

  def update_exclusions(id, exclusions) do
    Repo.transaction(fn ->
      # delete unpaired exclusions
      deleted_ids = case unmatched_exclusions(id, exclusions) |> Repo.delete_all(returning: true) do
                      {0, nil} -> []
                      {_, deleted} ->
                        Enum.map(deleted, fn el ->
                          if el.experiment_a_id == id do
                            el.experiment_b_id
                          else
                            el.experiment_a_id
                          end
                        end)
                    end
      # insert the rest if necessary
      entries = Enum.map(exclusions -- deleted_ids, & %{experiment_a_id: id, experiment_b_id: &1})
      Repo.insert_all(__MODULE__, entries, on_conflict: :nothing)
    end)
  end

  # finds unpaired rows to delete them
  defp unmatched_exclusions(id, exclusions) do
    from(e in __MODULE__,
      or_where: e.experiment_a_id == ^id and not(e.experiment_b_id in ^exclusions),
      or_where: e.experiment_b_id == ^id and not(e.experiment_a_id in ^exclusions))
  end
end
