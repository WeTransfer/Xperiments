defmodule Xperiments.Cms.ApplicationControllerTest do
  use XperimentsWeb.ConnCase, async: false
  alias Xperiments.Cms.Application

  setup do
    user = insert(:user, role: "admin")
    conn = sign_in(user)

    insert(:application)
    insert(:application, %{name: "backend"})
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

  @api_url "/api/v1/applications"

  test "/index return a list of applications", context do
    apps = Repo.all(Application) |> Poison.encode! |> Poison.decode!
    body =
      get(context.conn, @api_url)
      |> json_response(200)

    assert body["applications"] == apps
    assert is_map(hd(body["applications"])["settings"])
  end

  test "/create a new application", context do
    attrs = %{name: "mobile", settings: %{url: "http://wetransfer.net"}}
    body =
      post(context.conn, @api_url, %{application: attrs})
      |> json_response(201)

    assert body["application"]["name"] == "mobile"
    assert body["application"]["settings"]["url"] == "http://wetransfer.net"
  end

  test "/udpate an application", context do
    app = insert(:application, name: "mob")
    updates = %{name: "mobile"}
    body =
      put(context.conn, @api_url <> "/#{app.name}", %{application: updates})
      |> json_response(200)

    assert body["application"]["name"] == "mobile"
  end

  test "/delete an application", context do
    app = insert(:application)
    delete(context.conn, @api_url <> "/#{app.name}")
    |> json_response(200)

    assert Repo.get(Application, app.id) == nil
  end

  test "forbidden access for simple users except getting a list of applicatoins" do
    conn = sign_in(insert(:user))
    get(conn, @api_url)
    |> json_response(200)
    post(conn, @api_url, %{application: %{}})
    |> json_response(403)
    put(conn, @api_url <> "/1", %{application: %{}})
    |> json_response(403)
    delete(conn, @api_url <> "/1")
    |> json_response(403)
  end
end
