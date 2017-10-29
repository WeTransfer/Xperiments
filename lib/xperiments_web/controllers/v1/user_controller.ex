defmodule XperimentsWeb.V1.UserController do
  use XperimentsWeb, :controller
  alias Xperiments.Cms

  action_fallback XperimentsWeb.V1.FallbackController

  def index(conn, _params) do
    conn
    |> render("index.json", users: Cms.get_users_list())
  end

  def create(conn, %{"user" => user_params}) do
    with {:ok, user} <- Cms.create_user(user_params) do
      conn
      |> put_status(:created)
      |> render("show.json", user: user)
    end
  end

  def update(conn, %{"id" => id, "user" => updates}) do
    with {:ok, user} <- Cms.update_user(id, updates) do
      conn
      |> put_status(:ok)
      |> render("show.json", user: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    with {:ok, user} <- Cms.delete_user(id) do
      conn
      |> put_status(:ok)
      |> render("show.json", user: user)
    end
  end
end
