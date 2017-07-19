defmodule Xperiments.Web.V1.PayloadSchemaController do
  use Xperiments.Web, :controller
  alias Xperiments.PayloadSchema

  # plug :verify_authorized

  def index(conn, _params) do
    # conn = mark_authorized(conn)
    schemas = Repo.all(PayloadSchema)
    render conn, "index.json", schemas: schemas
  end

  def create(conn, %{"schema" => schema}) do
    conn = authorize!(conn, PayloadSchema)
    chset = PayloadSchema.changeset(%PayloadSchema{}, schema)

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

  def update(conn, %{"id" => id, "application" => updates}) do
    schema = Repo.get!(PayloadSchema, id)
    conn = authorize!(conn, schema)
    chset = PayloadSchema.changeset(schema, updates)

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
end
