defmodule XperimentsWeb.V1.ApplicationController do
  use XperimentsWeb, :controller
  alias Xperiments.Cms

  action_fallback XperimentsWeb.V1.FallbackController

  def index(conn, _params) do
    render conn, "index.json", applications: Cms.get_applications_list()
  end

  def create(conn, %{"application" => params}) do
    with {:ok, app} <- Cms.create_application(params) do
      conn
      |> put_status(:created)
      |> render("show.json", application: app)
    end
  end

  def update(conn, %{"name" => name, "application" => updates}) do
    with {:ok, app} <- Cms.update_application(name, updates) do
      conn
      |> put_status(:ok)
      |> render("show.json", application: app)
    end
  end

  def delete(conn, %{"name" => name}) do
    with {:ok, app} <- Cms.delete_application(name) do
      conn
      |> put_status(:ok)
      |> render("show.json", application: app)
    end
  end
end
