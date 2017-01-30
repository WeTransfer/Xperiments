defmodule Xperiments.Experiment do
  use Xperiments.Web, :model
  alias Xperiments.{Application, User, Variant, Rule}

  @primary_key {:id, :binary_id, autogenerate: true}

  schema "expirements" do
    field :name, :string
    field :description, :string
    field :start_date, Ecto.DateTime
    field :end_date, Ecto.DateTime
    field :sampling_rate, :decimal
    field :max_users, :integer

    belongs_to :application, Application
    belongs_to :user, User

    many_to_many :exclusions, __MODULE__, join_through: "expirements_exclusions", join_keys: [experiment_a_id: :id, experiment_b_id: :id]

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
    |> validate_required([:name, :description, :start_date, :end_date, :sampling_rate, :max_users])
  end
end
