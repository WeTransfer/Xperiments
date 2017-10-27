defmodule XperimentsWeb.HomeController do
  use XperimentsWeb, :controller
  use Guardian.Phoenix.Controller

  def index(conn, _params, user, _claims) do
    render conn, "index.html", user: {:safe, Poison.encode!(user)}
  end
end
