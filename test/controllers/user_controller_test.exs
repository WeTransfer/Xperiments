defmodule Xperiments.Cms.UserControllerTest do
  use XperimentsWeb.ConnCase, async: false
  alias Xperiments.Cms.User

  setup do
    user = insert(:user, role: "admin")
    conn = sign_in(user)

    insert_list(3, :user)
    {:ok, conn: conn}
  end

  def sign_in(user) do
    build_conn()
    |> bypass_through(Xperiments.Router, [:api, :browser])
    |> get("/")
    |> Map.update!(:state, fn (_) -> :set end)
    |> Guardian.Plug.sign_in(user, :token, [])
    |> send_resp(200, "Flush the session yo")
    |> recycle()
    |> put_req_header("accept", "application/json")
  end

  @api_url "/api/v1/users"

  test "/index return a list of users", context do
    body =
      get(context.conn, @api_url)
      |> json_response(200)

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

  test "forbidden access for simple users" do
    conn = sign_in(insert(:user))
    get(conn, @api_url)
    |> json_response(403)
    post(conn, @api_url, %{user: %{}})
    |> json_response(403)
    put(conn, @api_url <> "/1", %{user: %{}})
    |> json_response(403)
    delete(conn, @api_url <> "/1")
    |> json_response(403)
  end
end
