defmodule Xperiments.Application do
  use Xperiments.Web, :model
  alias Xperiments.Experiment

  schema "applications" do
    field :name, :string
    has_many :experiments, Experiment

    embeds_one :settings, Settings, on_replace: :update, primary_key: false do
      field :url
    end

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name])
    |> cast_embed(:settings, with: &settings_changeset/2)
    |> unique_constraint(:name)
    |> validate_required([:name])
    |> update_change(:name, &String.downcase/1)
  end

  def settings_changeset(changeset, params) do
    changeset
    |> cast(params, [:url])
  end

  ## Serializer

  defimpl Poison.Encoder, for: __MODULE__ do
    def encode(model, _opts) do
      model
      |> Map.from_struct
      |> Map.take([:name, :id, :settings])
      |> Poison.encode!
    end
  end
end
