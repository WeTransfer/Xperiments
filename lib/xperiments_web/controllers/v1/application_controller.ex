defmodule XperimentsWeb.V1.ApplicationController do
  use XperimentsWeb, :controller
  alias Xperiments.Cms

  action_fallback XperimentsWeb.V1.FallbackController
  plug :get_current_user

  def index(conn, _params) do
    with :ok <- Bodyguard.permit(Cms, :get_applications_list, conn.assigns.current_user) do
      render conn, "index.json", applications: Cms.get_applications_list()
    end
  end

  def create(conn, %{"application" => params}) do
    with :ok <- Bodyguard.permit(Cms, :create_application, conn.assigns.current_user),
         {:ok, app} <- Cms.create_application(params) do
      conn
      |> put_status(:created)
      |> render("show.json", application: app)
    end
  end

  def update(conn, %{"name" => name, "application" => updates}) do
    with :ok <- Bodyguard.permit(Cms, :update_application, conn.assigns.current_user),
         {:ok, app} <- Cms.update_application(name, updates) do
      conn
      |> put_status(:ok)
      |> render("show.json", application: app)
    end
  end

  def delete(conn, %{"name" => name}) do
    with :ok <- Bodyguard.permit(Cms, :delete_application, conn.assigns.current_user),
         {:ok, app} <- Cms.delete_application(name) do
      conn
      |> put_status(:ok)
      |> render("show.json", application: app)
    end
  end

  #
  # Private
  #

  defp get_current_user(conn, _params) do
    current_user = Guardian.Plug.current_resource(conn, :default)
    assign(conn, :current_user, current_user)
  end
end
