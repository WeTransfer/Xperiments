defmodule Xperiments.SessionController do
  use Xperiments.Web, :controller

  def new(conn, _params) do
    render(conn, "login.html", layout: false)
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
