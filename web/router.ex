defmodule Xperiments.Router do
  use Xperiments.Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
  end

  pipeline :browser_auth do
    plug Guardian.Plug.VerifySession
    plug Guardian.Plug.LoadResource
    plug Guardian.Plug.EnsureAuthenticated, handler: Xperiments.SessionController
  end

  pipeline :external do
    plug RemoteIp
    plug CORSPlug, origin: Application.get_env(:xperiments, :cors)[:origin]
  end

  pipeline :api_auth do
    plug :fetch_session
    plug Guardian.Plug.VerifySession
    plug Guardian.Plug.LoadResource
    plug Guardian.Plug.EnsureAuthenticated
    plug Xperiments.Plug.RefreshJwtToken
  end

  get "/healthcheck", HealthCheckPlug, []

  scope "/auth", Xperiments do
    pipe_through :browser

    get "/login", SessionController, :new, as: :login
    get "/logout", SessionController, :delete

    get "/:provider", AuthController, :request
    get "/:provider/callback", AuthController, :callback
  end

  scope "/api", Xperiments do
    pipe_through [:api, :api_auth]

    scope "/v1", as: :api_v1, alias: V1 do
      resources "/applications", ApplicationController, except: [:new], param: "name" do
        resources "/experiments", ExperimentController, except: [:delete, :new] do
          put "/state",  ExperimentController, :change_state, as: :state
          get "/variant/:variant_id", ExperimentController, :variant, as: :variant
        end
      end

      resources "/users", UserController, except: [:new]
    end
  end

  # Additional option routes added because of CORS
  scope "/assigner", Xperiments do
    pipe_through [:api, :external]

    post "/application/:app_name/experiments", AssignerController, :experiments
    options "/application/:app_name/experiments", AssignerController, :options

    post "/application/:app_name/experiments/events", AssignerController, :events
    options "/application/:app_name/experiments/events", AssignerController, :events

    get "/application/:app_name/experiments/:id/variants/:variant_id", AssignerController, :example
    options "/application/:app_name/experiments/:id/variants/:variant_id", AssignerController, :example
  end

  # should be last, because scope is too wide
  scope "/", Xperiments do
    pipe_through [:browser, :browser_auth]

    forward "/", HomeController, :index
  end
end
