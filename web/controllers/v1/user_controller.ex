defmodule Xperiments.V1.UserController do
  use Xperiments.Web, :controller
  alias Xperiments.User
  alias Xperiments.V1.ErrorView

  plug :verify_authorized

  def index(conn, _params) do
    users = Repo.all(User)
    conn
    |> authorize!(User)
    |> render("index.json", users: users)
  end

  def create(conn, %{"user" => user_data}) do
    conn = authorize!(conn, User)
    chset = User.changeset(%User{}, user_data)

    case Repo.insert(chset) do
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
    user = Repo.get!(User, id)
    conn = authorize!(conn, user)
    chset = User.changeset(user, updates)

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
    user = Repo.get!(User, id)
    conn = authorize!(conn, user)

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
