defmodule Xperiments.Router do
  use Xperiments.Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :browser do
    plug :accepts, ["html"]
  end

  pipeline :external do
    plug CORSPlug, origin: Application.get_env(:xperiments, :cors)[:origin]
  end

  scope "/api/v1", Xperiments do
    pipe_through :api

    resources "/applications", ApplicationController, only: [:index], param: :name do
      resources "/experiments", ExperimentController, except: [:delete, :new] do
        put "/state",  ExperimentController, :change_state, as: :state
        get "/variant/:variant_id", ExperimentController, :variant, as: :variant
      end
    end
  end

  scope "/assigner", Xperiments do
    pipe_through [:api, :external]

    post "/application/:app_name/experiments", AssignerController, :experiments
    options "/application/:app_name/experiments", AssignerController, :options

    get "/application/:app_name/experiments/:id/variants/:variant_id", AssignerController, :example
    options "/application/:app_name/experiments/:id/variants/:variant_id", AssignerController, :example
  end

  # should be last, because scope is too wide
  scope "/", Xperiments do
    pipe_through :browser

    forward "/", HomeController, :index
  end

end
