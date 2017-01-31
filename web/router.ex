defmodule Xperiments.Router do
  use Xperiments.Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :browser do
    plug :accepts, ["html"]
  end

  scope "/api", Xperiments do
    pipe_through :api
  end

  scope "/", Xperiments do
    get "/", HomeController, :index
  end
end
