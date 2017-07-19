defmodule Xperiments.Web.V1.PayloadSchemaControllerTest do
  use Xperiments.Web.ConnCase, async: false
  alias Xperiments.PayloadSchema

  @api_url "/api/v1/payload_schema"

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

    insert(:payload_schema)
    {:ok, conn: conn}
  end

  test "/index returns a alist of schemas for all applications", context do
    schemas = Repo.all(PayloadSchema) |> Poison.encode! |> Poison.decode!
    body =
      get(context.conn, @api_url)
      |> json_response(200)
    assert body["schemas"] == schemas
  end

  test "/create a new schema", context do
    app = insert(:application)
    attrs = %{key: "sh1", schema: "{'a': 1}", application_id: app.id}
    body =
      post(context.conn, @api_url, %{schema: attrs})
      |> json_response(201)

    assert body["schema"]
  end

  test "/udpate a schema", context do
    schema = insert(:payload_schema, schema: "{}")
    updates = %{schema: "{'b': 2}"}
    body =
      put(context.conn, @api_url <> "/#{schema.id}", %{application: updates})
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
