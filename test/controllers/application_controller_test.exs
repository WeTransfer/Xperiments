defmodule Xperiments.ApplicationControllerTest do
  use XperimentsWeb.ConnCase, async: false
  alias Xperiments.Application

  setup do
    user = insert(:user, role: "admin")

    conn =
      build_conn()
      |> bypass_through(Xperiments.Router, [:api, :browser])
      |> get("/")
      |> Map.update!(:state, fn (_) -> :set end)
      |> Guardian.Plug.sign_in(user, :token, [])
      |> send_resp(200, "Flush the session yo")
      |> recycle()
      |> put_req_header("accept", "application/json")

    insert(:application)
    insert(:application, %{name: "backend"})
    {:ok, conn: conn}
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
end
