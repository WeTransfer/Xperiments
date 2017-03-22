# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :xperiments,
  ecto_repos: [Xperiments.Repo]

config :xperiments, Experiment,
  stat_threshold: 100

# Configures the endpoint
config :xperiments, Xperiments.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "wmyoXASvGJLg451QAYP78cyDkFi9d5MEDmG73goFsFdzg0cnSYxYxcWptWjqHjBs",
  render_errors: [view: Xperiments.V1.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Xperiments.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Configure phoenix generators
config :phoenix, :generators,
  binary_id: true

config :xperiments, :cors,
  origin: "*"

config :xperiments, :seed,
  applications: [{"web", %{url: "http://lvh.me:5000"}}]

config :xperiments, :js_config,
  reporting_url: "https://analytics.google.com/analytics/web/?authuser=1#my-reports/5IyMQAn0Tcqdu2Va8V9BIg/a69714416w130256140p134086343/%3F_u.date00%3D20170227%26_u.date01%3D20170227%26_u.sampleOption%3Dmoreprecision%26_u.sampleSize%3D500000/"

config :ueberauth, Ueberauth,
  providers: [
    google: {Ueberauth.Strategy.Google, [default_scope: "email profile"]}
  ]

config :ueberauth, Ueberauth.Strategy.Google.OAuth,
  client_id: System.get_env("GOOGLE_CLIENT_ID"),
  client_secret: System.get_env("GOOGLE_CLIENT_SECRET"),
  redirect_uri: "http://lvh.me:5000"

config :guardian, Guardian,
  allowed_algos: ["HS512"], # optional
  verify_module: Guardian.JWT,  # optional
  issuer: "Xperiments",
  ttl: { 30, :minutes },
  allowed_drift: 2000,
  verify_issuer: true, # optional,
  secret_key: "VUAEd0LDnbMzsVl391tovxEoZ46UJAJBZRl2ZN5xfHt0wDXaMCohlERy/IP8SZvZ",
  serializer: Xperiments.GuardianSerializer

config :bodyguard, current_user: {Guardian.Plug, :current_resource}

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
