defmodule Xperiments.UserControllerTest do
  use Xperiments.Web.ConnCase, async: false
  alias Xperiments.User

  setup do
    params = params_for(:user, password: "123456", role: "user")
    params = for {key, val} <- params, into: %{}, do: {Atom.to_string(key), val}
    {:ok, user} = User.changeset(%User{}, params) |> User.create()

    conn =
      Phoenix.ConnTest.build_conn()
      |> bypass_through(Xperiments.Router, [:api, :browser])
      |> post("/api/v1/sessions", %{email: user.email, password: "123456"})
      |> Map.update!(:state, fn (_) -> :set end)
      |> Guardian.Plug.sign_in(user, :token, [])
      |> recycle()

    insert_list(3, :user)
    {:ok, conn: conn}
  end

  @api_url "/api/v1/users"

  test "/index return a list of users", context do
    body =
      get(context.conn, @api_url)
      |> json_response(200)

    assert length(body["users"]) == 4
  end

  test "/create a new user", context do
    attrs = %{name: "Dostoevsky", email: "dostoevsky@wetransfer.com", password: "123456"}
    body =
      post(context.conn, @api_url, %{user: attrs})
      |> json_response(201)

    assert body["user"]["email"] == "dostoevsky@wetransfer.com"
    assert body["user"]["role"] == "user"
  end

  test "/create with an empty password and return errors", context do
    attrs = %{name: "Dostoevsky", email: "dostoevsky@wetransfer.com", password: ""}
    body =
      post(context.conn, @api_url, %{user: attrs})
    |> json_response(422)

    assert body["errors"] == %{"password" => ["can't be blank"]}
  end

  test "/udpate an user", context do
    user = insert(:user, name: "Stolypin")
    updates = %{name: "Lev"}
    body =
      put(context.conn, @api_url <> "/#{user.id}", %{user: updates})
      |> json_response(200)

    assert body["user"]["name"] == "Lev"
  end

  test "/delete an user", context do
    user = insert(:user)
    delete(context.conn, @api_url <> "/#{user.id}")
    |> json_response(200)

    assert Repo.get(User, user.id) == nil
  end
end
