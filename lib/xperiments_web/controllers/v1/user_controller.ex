defmodule XperimentsWeb.V1.UserController do
  use XperimentsWeb, :controller
  alias Xperiments.Cms

  action_fallback XperimentsWeb.V1.FallbackController
  plug :get_current_user

  def index(conn, _params) do
    with :ok <- Bodyguard.permit(Cms, :list_users, conn.assigns.current_user) do
      render(conn, "index.json", users: Cms.get_users_list())
    end
  end

  def create(conn, %{"user" => user_params}) do
    with :ok <- Bodyguard.permit(Cms, :create_user, conn.assigns.current_user),
         {:ok, user} <- Cms.create_user(user_params) do
      conn
      |> put_status(:created)
      |> render("show.json", user: user)
    end
  end

  def update(conn, %{"id" => id, "user" => updates}) do
    with :ok <- Bodyguard.permit(Cms, :update_user, conn.assigns.current_user),
         {:ok, user} <- Cms.update_user(id, updates) do
      conn
      |> put_status(:ok)
      |> render("show.json", user: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    with :ok <- Bodyguard.permit(Cms, :delete_user, conn.assigns.current_user),
         {:ok, user} <- Cms.delete_user(id) do
      conn
      |> put_status(:ok)
      |> render("show.json", user: user)
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
