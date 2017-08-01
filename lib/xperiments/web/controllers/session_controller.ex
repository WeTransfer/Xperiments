defmodule Xperiments.Web.SessionController do
  use Xperiments.Web, :controller

  def new(conn, _params) do
    render(conn, "login.html", layout: false)
  end

  def create(conn, params) do
    case Xperiments.User.find_and_confirm_password(params) do
      {:ok, user} ->
        conn
        |> Guardian.Plug.sign_in(user)
        |> redirect(to: "/")
      {:error, reason} ->
        render conn, "login.html", layout: false, reason: reason
    end
  end

  def delete(conn, _params) do
    Guardian.Plug.sign_out(conn)
    |> redirect(to: "/")
  end

  def unauthenticated(conn, _params) do
    conn
    |> redirect(to: "/auth/login")
  end
end
