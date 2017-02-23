defmodule Xperiments.Experiment do
  @moduledoc """
  The module stores all information about an experiment.
  It belongs to parents: Users and Application. And has many_to_many
  for exclusion logic, so it's possible to set which experiments should
  be excluded from each other.

  *Variants* and *rules* are stored in JSONB fields.
  """
  use Xperiments.Web, :model
  alias Xperiments.{Application, Variant, Rule}

  use EctoStateMachine,
    states: [:draft, :running, :stopped, :terminated, :deleted],
    events: [
      [
        name:  :run,
        from:  [:draft, :stopped],
        to:    :running,
        callback: &(changeset_run_state(&1))
      ], [
        name:  :stop,
        from:  [:running],
        to:    :stopped
      ], [
        name:  :terminate,
        from:  [:stopped],
        to:    :terminated
      ], [
        name:  :delete,
        from:  [:terminated, :draft],
        to:    :deleted
      ]
    ]

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "experiments" do
    field :name, :string
    field :description, :string
    field :start_date, :utc_datetime
    field :end_date, :utc_datetime
    field :sampling_rate, :decimal, default: 100
    field :max_users, :integer
    field :state, :string, default: "draft"

    belongs_to :application, Application

    # used only for tests now, delete it after tests refactoring
    many_to_many :exclusions, __MODULE__, join_through: Xperiments.Exclusion,
      join_keys: [experiment_a_id: :id, experiment_b_id: :id], on_replace: :delete

    embeds_many :variants, Variant, on_replace: :delete
    embeds_many :rules, Rule, on_replace: :delete

    embeds_one :statistics, Statistics, primary_key: false, on_replace: :update do
      field :common_impression, :integer, default: 0
      field :variants_impression, :map, default: %{}
    end

    timestamps()
  end

  @allowed_params ~w(name description start_date end_date sampling_rate max_users)

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @allowed_params)
    |> validate_required([:name, :description, :start_date, :end_date, :sampling_rate])
    |> validate_end_date_greater_start_date([:start_date, :end_date])
    |> validate_current_or_future_date(:start_date)
    |> validate_current_or_future_date(:end_date)
    |> validate_number(:sampling_rate, greater_than: 0, less_than_or_equal_to: 100)
    |> maybe_validate_number(:max_users, greater_than: 0)
  end

  def changeset_update(struct, params \\ %{}) do
    struct
    |> changeset(params)
    |> validate_allowed_state()
    |> cast_embed(:variants, required: true)
    |> cast_embed(:rules)
  end

  def changeset_run_state(struct) do
    struct
    |> validate_model_has_variants
    |> validate_variants
    |> validate_at_least_variant_is_control_group
    |> validate_current_or_future_date(:start_date)
    |> validate_current_or_future_date(:end_date)
  end

  # TODO: Make a refactor for dates validation
  def validate_end_date_greater_start_date(changeset, [start_date_field, end_date_field]) do
    # TODO: use `with` here
    start_date = get_field(changeset, start_date_field)
    end_date = get_field(changeset, end_date_field)
    do_compare_two_dates(changeset, :__shared__, end_date, start_date, "End date must be greater than start date")
  end

  def validate_current_or_future_date(changeset, field) do
    case get_field(changeset, field) do
      nil -> changeset
      date -> do_compare_two_dates(changeset, field, date, DateTime.utc_now, "Date in the past")
    end
  end

  def do_compare_two_dates(changeset, _, nil, nil, _), do: changeset
  def do_compare_two_dates(changeset, field, start_date, end_date, message) do
    case DateTime.compare(start_date, end_date) do
      :lt -> add_error(changeset, field, message)
      _ -> changeset
    end
  end

  @doc """
  Validates any given number, only if it set, otherwise does nothing
  """
  def maybe_validate_number(changeset, nil, _opts), do: changeset
  def maybe_validate_number(changeset, field, opts) do
    validate_number(changeset, field, opts)
  end

  @doc """
  Validate that an experiment has variants and allow to run it
  """
  def validate_model_has_variants(changeset) do
    if length(changeset.data.variants) == 0 do
      add_error(changeset, :variants, "It should be at least one variant to run an experiment")
    else
      changeset
    end
  end

  @doc """
  Checks that sum of allocations of all provided variants equals to 100
  """
  def validate_variants(changeset) do
    sum_allocation =
      Ecto.Changeset.get_field(changeset, :variants)
      |> Enum.reduce(0, & &1.allocation + &2)
    if sum_allocation != 100 do
      add_error(changeset, :variants, "Sum of allocations for variants should be 100")
    else
      changeset
    end
  end

  @doc """
  Validate that at least one variant is a control group when run an experiment
  """
  def validate_at_least_variant_is_control_group(changeset) do
    control_variant =
      Ecto.Changeset.get_field(changeset, :variants)
      |> Enum.find(&(&1.control_group == true))
    if control_variant do
      changeset
    else
      add_error(changeset, :variants, "At least one variant should be a control group")
    end
  end

  @doc """
  Allow update only if state is draft
  """
  def validate_allowed_state(changeset) do
    if changeset.data.state != "draft" do
      add_error(changeset, :state, "It's possible to update an Experiment only in draft state")
    else
      changeset
    end
  end

  @doc """
  Tries to change a state for a given experiment and returns a changeset
  """
  def change_state(experiment, event) do
    case event do
      "run" ->
        __MODULE__.run(experiment)
      "stop" ->
        __MODULE__.stop(experiment)
      "terminate" ->
        __MODULE__.terminate(experiment)
      "delete" ->
        __MODULE__.delete(experiment)
    end
  end

  def update_statistics(id, stat) do
    Ecto.Changeset.change(%__MODULE__{id: id})
    |> Ecto.Changeset.put_embed(:statistics, stat)
    |> Xperiments.Repo.update!
  end

  def set_terminated_state(id) do
    __MODULE__.terminate(%__MODULE__{id: id, state: "stopped"})
    |> Xperiments.Repo.update!
  end

  ## Queries

  def ready_to_run(query) do
    from e in query,
      where: e.state in ["running", "stopped"]
  end

  def all_for_application(app) do
    from(e in __MODULE__,
      where: e.application_id == ^app.id,
      where: e.state != "deleted")
  end

  def avialable_experiments_for_exclsions(app, ids \\ []) do
    from(e in __MODULE__,
      where: e.application_id == ^app.id,
      where: e.id in ^ids,
      where: e.state in ["running", "stopped", "draft"])
  end

  ## Serializer

  defimpl Poison.Encoder, for: __MODULE__ do
    def encode(model, _opts) do
      model
      |> Map.from_struct
      |> Map.drop([:__meta__, :__struct__, :application])
      |> Poison.encode!
    end
  end
end
