defmodule Xperiments.Web.HomeController do
  use Xperiments.Web, :controller
  use Guardian.Phoenix.Controller

  def index(conn, _params, user, _claims) do
    render conn, "index.html", user: {:safe, Poison.encode!(user)}
  end
end
