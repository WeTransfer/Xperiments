defmodule Xperiments.PayloadSchema do
  use Ecto.Schema
  import Ecto.Changeset
  alias Xperiments.PayloadSchema


  schema "payload_schemas" do
    field :key, :string
    field :schema, :string
    field :name, :string
    field :defaults, :string

    belongs_to :application, Xperiments.Application

    timestamps()
  end

  @doc false
  def changeset(%PayloadSchema{} = payload_schema, attrs) do
    payload_schema
    |> cast(attrs, [:key, :schema, :name, :defaults])
    |> validate_required([:key, :schema, :name, :defaults])
    |> unique_constraint(:key)
  end

  ## Serializer

  defimpl Poison.Encoder, for: __MODULE__ do
    def encode(model, _opts) do
      model
      |> Map.from_struct
      |> Map.take([:key, :schema, :application_id])
      |> Poison.encode!
    end
  end
end
