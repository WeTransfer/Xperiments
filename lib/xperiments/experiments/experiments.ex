defmodule Xperiments.Experiments do
  @moduledoc """
  Experiments context
  """
  import Ecto.Query, warn: false
  alias Xperiments.Repo
  alias Xperiments.Experiments.{Experiment, Exclusion}

  def get_experiments_for_app(app) do
    Experiment.all_for_application(app)
    |> Repo.all
    |> Enum.map(fn ex -> Map.merge(ex, %{exclusions: Exclusion.for_experiment(ex.id)}) end)
  end

  def get_experiment(id) do
    Repo.get!(Experiment, id)
    |> Map.merge(%{exclusions: get_exclusions_for_experiment(id)})
  end

  def create_experiment(params, current_user, current_application) do
    Experiment.changeset(%Experiment{}, params)
    |> Ecto.Changeset.put_assoc(:application, current_application)
    |> Ecto.Changeset.put_assoc(:user, current_user)
    |> Repo.insert()
  end

  def update_experiment(id, params, current_application) do
    exp = Repo.get!(Experiment, id)
    {exclusions, params} = Map.pop(params, "exclusions", [])
    # NOTE: Maybe unnecessary step now
    exclusions =
      Experiment.avialable_experiments_for_exclsions(current_application, exclusions)
      |> Repo.all()
    changeset = Experiment.changeset_update(exp, params)
    # TODO: Use Multi to use all changes in one transaction and handle results
    Exclusion.update_exclusions(id, Enum.map(exclusions, & &1.id))
    Repo.update(changeset)
  end

  def change_experiment_state(id, event) do
    experiment = Repo.get!(Experiment, id)
    changeset = Experiment.change_state(experiment, event)
    Repo.update(changeset)
    |> Tuple.append(changeset.data.state)
  end

  def get_exclusions_for_experiment(id) do
    Exclusion.for_experiment(id)
  end

  def is_allowed_event(event) do
    case String.to_atom(event) in Experiment.events do
      true -> :ok
      false -> {:error, :bad_request}
    end
  end

  def get_variant_of_experiment(e_id, var_id) do
    experiment = Repo.get!(Experiment, e_id)
    case Enum.find(experiment.variants, &(&1.id == var_id)) do
      nil -> {:error, :experiment_not_found, [e_id, var_id]}
      variant -> {:ok, variant}
    end
  end
end
