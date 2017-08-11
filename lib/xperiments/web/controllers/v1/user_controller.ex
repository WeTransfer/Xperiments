defmodule Xperiments.Web.V1.UserController do
  use Xperiments.Web, :controller
  alias Xperiments.User
  alias Xperiments.Web.V1.ErrorView

  # plug :verify_authorized

  def index(conn, _params) do
    # current_user = Guardian.Plug.current_resource(conn)
    # conn = authorize!(conn, current_user)
    users = Repo.all(User)
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_data}) do
    # current_user = Guardian.Plug.current_resource(conn)
    # conn = authorize!(conn, current_user)
    chset = User.changeset(%User{}, user_data)

    case User.create(chset) do
      {:ok, user} ->
        conn
        |> put_status(:created)
        |> render("show.json", user: user)
      {:error, chset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(ErrorView, "error.json", changeset: chset)
    end
  end

  def update(conn, %{"id" => id, "user" => updates}) do
    # current_user = Guardian.Plug.current_resource(conn)
    user = Repo.get!(User, id)
    # conn = authorize!(conn, current_user)
    chset = User.update_changeset(user, updates)

    case Repo.update(chset) do
      {:ok, user} ->
        conn
        |> put_status(:ok)
        |> render("show.json", user: user)
      {:error, chset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(ErrorView, "error.json", changeset: chset)
    end
  end

  def delete(conn, %{"id" => id}) do
    # current_user = Guardian.Plug.current_resource(conn)
    user = Repo.get!(User, id)
    # conn = authorize!(conn, current_user)

    case Repo.delete(user) do
      {:ok, user} ->
        conn
        |> put_status(:ok)
        |> render("show.json", user: user)
      {:error, chset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(ErrorView, "error.json", changeset: chset)
    end
  end
end
