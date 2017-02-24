defmodule Xperiments.User do
  use Xperiments.Web, :model
  alias Xperiments.Repo
  alias Ueberauth.Auth

  schema "users" do
    field :email, :string
    field :name, :string
    field :role, :string, default: "user"

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

  ## Auth

  def find_or_create(%Auth{} = auth) do
    case Repo.get_by(__MODULE__, email: auth.info.email) do
      nil ->
        user =
          changeset(%__MODULE__{}, Map.from_struct(auth.info))
          |> Repo.insert!
        {:ok, user}
      user -> {:ok, user}
    end
  end

  ## Serializer

  defimpl Poison.Encoder, for: __MODULE__ do
    def encode(model, _opts) do
      model
      |> Map.from_struct
      |> Map.take([:name, :email, :role])
      |> Poison.encode!
    end
  end
end
