defmodule Xperiments.Web.Router do
  use Xperiments.Web, :router

  pipeline :external do
    plug RemoteIp
    plug CORSPlug, origin: Application.get_env(:xperiments, :cors)[:origin]
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
  end

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
  end

  pipeline :browser_auth do
    plug Guardian.Plug.VerifySession
    plug Guardian.Plug.LoadResource
    plug Guardian.Plug.EnsureAuthenticated, handler: Xperiments.Web.HomeController
  end

  pipeline :api_auth do
    plug :fetch_session
    plug Guardian.Plug.VerifySession
    plug Guardian.Plug.LoadResource
    plug Guardian.Plug.EnsureAuthenticated
    plug Xperiments.Plug.RefreshJwtToken
  end

  get "/healthcheck", HealthCheckPlug, []

  scope "/auth", Xperiments.Web do
    pipe_through :browser

    get "/:provider", AuthController, :request
    get "/:provider/callback", AuthController, :callback
  end

  scope "/api", Xperiments.Web do
    pipe_through :api

    resources "/v1/sessions", V1.SessionController, only: [:create, :new]

    scope "/v1", as: :api_v1, alias: V1 do
      pipe_through :api_auth

      resources "/users", UserController, except: [:new]
      resources "/applications", ApplicationController, except: [:new], param: "name" do
        resources "/experiments", ExperimentController, except: [:delete, :new] do
          put "/state",  ExperimentController, :change_state, as: :state
          get "/variant/:variant_id", ExperimentController, :variant, as: :variant
        end
      end
    end
  end

  # Additional option routes added because of CORS
  scope "/assigner", Xperiments.Web do
    pipe_through [:api, :external]

    post "/application/:app_name/experiments", AssignerController, :experiments
    options "/application/:app_name/experiments", AssignerController, :options

    post "/application/:app_name/experiments/events", AssignerController, :events
    options "/application/:app_name/experiments/events", AssignerController, :events

    get "/application/:app_name/experiments/:id/variants/:variant_id", AssignerController, :example
    options "/application/:app_name/experiments/:id/variants/:variant_id", AssignerController, :example
  end

  # should be last, because scope is too wide
  scope "/", Xperiments.Web do
    pipe_through [:browser]

    get "/", HomeController, :index
  end
end
