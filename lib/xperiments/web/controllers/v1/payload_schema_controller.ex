defmodule Xperiments.Web.V1.PayloadSchemaController do
  use Xperiments.Web, :controller
  alias Xperiments.{PayloadSchema, Application}
  alias Xperiments.Web.V1.ErrorView

  plug :get_application
  # plug :verify_authorized

  def index(conn, _params) do
    conn = authorize!(conn, PayloadSchema)
    schemas = Repo.all(assoc(conn.assigns.application, :payload_schemas))
    render conn, "index.json", schemas: schemas
  end

  def create(conn, %{"schema" => schema}) do
    conn = authorize!(conn, PayloadSchema)
    chset =
      PayloadSchema.changeset(%PayloadSchema{}, schema)
      |> Ecto.Changeset.put_assoc(:application, conn.assigns.application)

    case Repo.insert(chset) do
      {:ok, rec} ->
        conn
        |> put_status(:created)
        |> render("show.json", schema: rec)
      {:error, chset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(ErrorView, "error.json", changeset: chset)
    end
  end

  # TODO: we don't check that schema actually belongs to a give application
  def update(conn, %{"id" => id, "schema" => updates}) do
    schema = Repo.get!(PayloadSchema, id)
    conn   = authorize!(conn, schema)
    chset  = PayloadSchema.changeset(schema, updates)

    case Repo.update(chset) do
      {:ok, schema} ->
        conn
        |> put_status(:ok)
        |> render("show.json", schema: schema)
      {:error, chset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(ErrorView, "error.json", changeset: chset)
    end
  end

  def delete(conn, %{"id" => id}) do
    schema = Repo.get!(PayloadSchema, id)
    conn = authorize!(conn, schema)

    case Repo.delete(schema) do
      {:ok, schema} ->
        conn
        |> put_status(:ok)
        |> render("show.json", schema: schema)
      {:error, chset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(ErrorView, "error.json", changeset: chset)
    end
  end

  # TODO: extract it, because uses in ExprimentController as well
  defp get_application(conn, _params) do
    app_name = conn.params["application_name"]
    case Repo.get_by(Application, name: app_name) do
      nil ->
        err_message = "The application #{app_name} doesn't exists"
        put_status(conn, :unprocessable_entity)
        |> render(Xperiments.Web.V1.ErrorView, "common_error.json", %{error: %{application: err_message}})
        |> halt()
      app ->
        assign(conn, :application, app)
    end
  end
end
