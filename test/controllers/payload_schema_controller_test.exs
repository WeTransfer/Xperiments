defmodule Xperiments.Web.V1.PayloadSchemaControllerTest do
  use Xperiments.Web.ConnCase, async: false
  alias Xperiments.PayloadSchema

  @api_url "/api/v1/applications/web/payload_schema"

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

    app = insert(:application, name: "web")
    insert(:payload_schema, application: app)
    {:ok, conn: conn, app: app}
  end

  test "/index returns a alist of schemas for all applications", context do
    schemas = assoc(context.app, :payload_schemas) |> Repo.all |> Poison.encode! |> Poison.decode!
    body =
      get(context.conn, @api_url)
      |> json_response(200)
    assert body["schemas"] == schemas
  end

  test "/create a new schema", context do
    attrs = %{key: "sh1", schema: "{'a': 1}", name: "hey", defaults: "{}"}
    body =
      post(context.conn, @api_url, %{schema: attrs})
      |> json_response(201)

    assert body["schema"]["key"] == "sh1"
  end

  test "/udpate a schema", context do
    schema = insert(:payload_schema, schema: "{}")

    updates = %{schema: "{'b': 2}"}
    body =
      put(context.conn, @api_url <> "/#{schema.id}", %{schema: updates})
      |> json_response(200)

    assert body["schema"]["schema"] == "{'b': 2}"
  end

  test "/delete a schema", context do
    schema = insert(:payload_schema)
    delete(context.conn, @api_url <> "/#{schema.id}")
    |> json_response(200)

    assert Repo.get(PayloadSchema, schema.id) == nil
  end
end
