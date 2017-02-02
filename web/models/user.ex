defmodule Xperiments.User do
  use Xperiments.Web, :model
  alias Xperiments.Experiment

  schema "users" do
    field :email, :string
    field :name, :string
    field :role, :string

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:email, :name, :role])
    |> validate_required([:email, :name, :role])
  end
end
