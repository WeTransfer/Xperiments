defmodule Xperiments.UserControllerTest do
  use Xperiments.ConnCase, async: false
  alias Xperiments.User

  setup do
    user = insert(:user, role: "admin")

    conn =
      build_conn()
      |> bypass_through(Xperiments.Router, [:api, :browser])
      |> get("/")
      |> Guardian.Plug.sign_in(user, :token, [])
      |> send_resp(200, "Flush the session yo")
      |> recycle()
      |> put_req_header("accept", "application/json")

    insert_list(3, :user)
    {:ok, conn: conn}
  end

  @api_url "/api/v1/users"

  test "/index return a list of users", context do
    users = Repo.all(User) |> Poison.encode! |> Poison.decode!
    body =
      get(context.conn, @api_url)
      |> json_response(200)

    assert body["users"] == users
    assert length(body["users"]) == 4
  end

  test "/create a new user", context do
    attrs = %{name: "Dostoevsky", email: "dostoevsky@wetransfer.com"}
    body =
      post(context.conn, @api_url, %{user: attrs})
      |> json_response(201)

    assert body["user"]["email"] == "dostoevsky@wetransfer.com"
    assert body["user"]["role"] == "user"
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