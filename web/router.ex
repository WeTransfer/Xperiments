defmodule Xperiments.Router do
  use Xperiments.Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :browser do
    plug :accepts, ["html"]
  end

  scope "/api/v1", Xperiments do
    pipe_through :api

    resources "/applications", ApplicationController, only: [:index], param: :name do
      resources "/experiments", ExperimentController, except: [:delete, :new] do
        put "/state", ExperimentController, :change_state, as: :state
      end
    end
  end

  scope "/assigner", Xperiments do
    pipe_through :api

    get "/application/:app_name/experiments", AssignerController, :experiments
  end

  # should be last, because scope is too wide
  scope "/", Xperiments do
    pipe_through :browser

    forward "/", HomeController, :index
  end

end
