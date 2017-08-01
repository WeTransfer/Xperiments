defmodule Xperiments.User do
  use Xperiments.Web, :model
  alias Xperiments.Repo
  alias Ueberauth.Auth

  schema "users" do
    field :email, :string
    field :name, :string
    field :role, :string, default: "user"
    field :avatar_uri, :string
    field :encrypted_password, :string
    field :password, :string, virtual: true

    has_many :experiments, Xperiments.Experiment

    timestamps()
  end

  @doc "Builds a changeset based on the `struct` and `params`."
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:email, :name, :role, :password])
    |> unique_constraint(:email)
    |> validate_format(:email, ~r/@/)
    |> validate_length(:password, min: 6)
    |> validate_required([:email, :name, :role, :password])
  end

  def update_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :role, :password])
    |> validate_length(:password, min: 6)
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

  def create(changeset) do
    changeset
    |> put_change(:encrypted_password, hashed_password(changeset.params["password"]))
    |> Repo.insert()
  end

  def find_and_confirm_password(%{"email" => email, "password" => password}) do
    find_by_email_with_not_nil_password(email)
    |> Repo.one()
    |> Comeonin.Pbkdf2.check_pass(password)
  end

  def find_by_email_with_not_nil_password(email) do
    from u in __MODULE__,
      where: u.email == ^email and not is_nil(u.encrypted_password)
  end

  #
  # Private
  #

  defp prepare_user_struct(auth_info) do
    auth_info
    |> Map.from_struct
    |> Map.take([:name, :email])
    |> Map.merge(%{avatar_uri: auth_info.image})
  end

  defp hashed_password(password) do
    Comeonin.Pbkdf2.hashpwsalt(password)
  end

  #
  # Serializer
  #

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
