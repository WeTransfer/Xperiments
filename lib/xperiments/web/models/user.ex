defmodule Xperiments.User do
  use Xperiments.Web, :model
  alias Xperiments.Repo
  alias Ueberauth.Auth

  schema "users" do
    field :email, :string
    field :name, :string
    field :role, :string, default: "user"
    field :avatar_uri, :string

    has_many :experiments, Xperiments.Experiment

    timestamps()
  end

  @doc "Builds a changeset based on the `struct` and `params`."
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:email, :name, :role])
    |> validate_required([:email, :name, :role])
  end

  ## Auth

  def find_or_create(%Auth{} = auth) do
    if List.last(String.split(auth.info.email, "@")) != "wetransfer.com" do
      {:error, "company emails only allowed"}
    else
      case Repo.get_by(__MODULE__, email: auth.info.email) do
        nil ->
          user =
            changeset(%__MODULE__{}, prepare_user_struct(auth.info))
            |> Repo.insert!
          {:ok, user}
        user -> {:ok, user}
      end
    end
  end

  defp prepare_user_struct(auth_info) do
    auth_info
    |> Map.from_struct
    |> Map.take([:name, :email])
    |> Map.merge(%{avatar_uri: auth_info.image})
  end

  ## Serializer

  defimpl Poison.Encoder, for: __MODULE__ do
    def encode(model, _opts) do
      model
      |> Map.from_struct
      |> Map.take([:name, :email, :role, :id, :avatar_uri])
      |> add_token()
      |> Poison.encode!
    end

    def add_token(user) do
      salt = Application.get_env(:xperiments, Xperiments.Web.Endpoint)[:secret_key_base]
      token = Phoenix.Token.sign(Xperiments.Web.Endpoint, salt, user.id)
      Map.put_new(user, :token, token)
    end
  end
end
