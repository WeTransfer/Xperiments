defmodule Xperiments.Experiment do
  use Xperiments.Web, :model
  alias Xperiments.{Application, User}

  schema "expirements" do
    field :name, :string
    field :description, :string
    field :start_date, Ecto.DateTime
    field :end_date, Ecto.DateTime
    field :sampling_rate, :decimal
    field :max_users, :integer

    belongs_to :application, Application
    belongs_to :user, User

    timestamps()
  end

  @primary_key {:id, :binary_id, autogenerate: true}

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :description, :start_date, :end_date, :sampling_rate, :max_users])
    |> validate_required([:name, :description, :start_date, :end_date, :sampling_rate, :max_users])
  end
end
