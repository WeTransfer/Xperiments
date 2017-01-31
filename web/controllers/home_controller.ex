defmodule Xperiments.HomeController do
  use Xperiments.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
