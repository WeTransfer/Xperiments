defmodule Xperiments.Application do
  use Xperiments.Web, :model
  alias Xperiments.Experiment

  schema "applications" do
    field :name, :string
    has_many :experiments, Experiment

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name])
    |> validate_required([:name])
  end

  ## Serializer

  defimpl Poison.Encoder, for: __MODULE__ do
    def encode(model, opts) do
      model
      |> Map.from_struct
      |> Map.take([:name, :id])
      |> Poison.encode!
    end
  end
end
