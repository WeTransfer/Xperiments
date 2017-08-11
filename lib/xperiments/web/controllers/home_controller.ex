defmodule Xperiments.Web.HomeController do
  use Xperiments.Web, :controller
  use Guardian.Phoenix.Controller

  def index(conn, _params, user, _claims) do
    render conn, "index.html", user: {:safe, Poison.encode!(user)}
  end

  def index(conn, _params) do
    render conn, "index.html", user: {:safe, ""}
  end

  def unauthenticated(conn, _params) do
  end
end
