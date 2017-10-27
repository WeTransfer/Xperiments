defmodule XperimentsWeb.V1.ApplicationController do
  use XperimentsWeb, :controller
  alias Xperiments.Application

  plug :verify_authorized

  def index(conn, _params) do
    conn = mark_authorized(conn)
    apps = Repo.all(Application)
    render conn, "index.json", applications: apps
  end

  def create(conn, %{"application" => app}) do
    conn = authorize!(conn, Application)
    chset = Application.changeset(%Application{}, app)

    case Repo.insert(chset) do
      {:ok, app} ->
        conn
        |> put_status(:created)
        |> render("show.json", application: app)
      {:error, chset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(ErrorView, "error.json", changeset: chset)
    end
  end

  def update(conn, %{"name" => name, "application" => updates}) do
    app = Repo.get_by!(Application, name: name)
    conn = authorize!(conn, app)
    chset = Application.changeset(app, updates)

    case Repo.update(chset) do
      {:ok, app} ->
        conn
        |> put_status(:ok)
        |> render("show.json", application: app)
      {:error, chset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(ErrorView, "error.json", changeset: chset)
    end
  end

  def delete(conn, %{"name" => name}) do
    app = Repo.get_by!(Application, name: name)
    conn = authorize!(conn, app)

    case Repo.delete(app) do
      {:ok, app} ->
        conn
        |> put_status(:ok)
        |> render("show.json", application: app)
      {:error, chset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(ErrorView, "error.json", changeset: chset)
    end
  end
end
