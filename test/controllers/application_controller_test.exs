defmodule Xperiments.ApplicationControllerTest do
  use Xperiments.Web.ConnCase, async: false
  alias Xperiments.{Application, User}

  setup do
    user = insert(:user, role: "admin")

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
