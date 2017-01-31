defmodule Xperiments.Experiment do
  @moduledoc """
  The module stores all information about an experiment.
  It belongs to parents: Users and Application. And has many_to_many
  for exclusion logic, so it's possible to set which experiments should
  be excluded from each other.

  *Variants* and *rules* are stored in JSONB fields.
  """
  use Xperiments.Web, :model
  alias Xperiments.{Application, User, Variant, Rule}

  use EctoStateMachine,
    states: [:draft, :running, :stopped, :terminated, :deleted],
    events: [
      [
        name:  :run,
        from:  [:draft, :stopped],
        to:    :running
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
  schema "expirements" do
    field :name, :string
    field :description, :string
    field :start_date, Ecto.DateTime
    field :end_date, Ecto.DateTime
    field :sampling_rate, :decimal
    field :max_users, :integer
    field :state, :string, default: "draft"

    belongs_to :application, Application
    belongs_to :user, User

    many_to_many :exclusions, __MODULE__, join_through: "expirements_exclusions",
      join_keys: [experiment_a_id: :id, experiment_b_id: :id]

    embeds_many :variants, Variant
    embeds_many :rules, Rule

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :description, :start_date, :end_date, :sampling_rate, :max_users])
    |> validate_required([:name, :description, :start_date, :end_date])
    |> validate_required_at_least_one([:sampling_rate, :max_users])
  end

  defp validate_required_at_least_one(changeset, [field | tail]) do
    case get_field(changeset, field) do
      nil -> validate_required_at_least_one(changeset, tail)
      _ -> validate_required(changeset, field)
    end
  end
  defp validate_required_at_least_one(changeset, []) do
    add_error(changeset, :sampling_rate, "required at least one field")
  end

end
