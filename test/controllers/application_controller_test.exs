defmodule Xperiments.ApplicationControllerTest do
  use Xperiments.ConnCase, async: false
  alias Xperiments.Application

  setup do
    user = insert(:user)

    conn =
      build_conn()
      |> bypass_through(Xperiments.Router, [:api, :browser])
      |> get("/")
      |> Guardian.Plug.sign_in(user, :token, [])
      |> send_resp(200, "Flush the session yo")
      |> recycle()
      |> put_req_header("accept", "application/json")

    insert(:application)
    insert(:application, %{name: "backend"})
    {:ok, conn: conn}
  end

  test "/index return a list of applications", context do
    apps = Repo.all(Application) |> Poison.encode! |> Poison.decode!
    response = get(context[:conn], "/api/v1/applications")
    body = json_response(response, 200)

    assert body["applications"] == apps
    assert is_map(hd(body["applications"])["settings"])
  end
end
