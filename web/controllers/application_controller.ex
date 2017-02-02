defmodule Xperiments.ApplicationController do
  use Xperiments.Web, :controller
  alias Xperiments.Application

  def index(conn, _params) do
    apps = Repo.all(Application)
    render conn, "index.json", applications: apps
  end

end
