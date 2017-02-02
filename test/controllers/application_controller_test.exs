defmodule Xperiments.ApplicationControllerTest do
  use Xperiments.ConnCase, async: false
  alias Xperiments.Application

  setup do
    conn =
      build_conn()
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
  end
end
