defmodule Xperiments.Router do
  use Xperiments.Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", Xperiments do
    pipe_through :api
  end
end
