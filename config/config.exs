# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :xperiments,
  ecto_repos: [Xperiments.Repo]

# Configures the endpoint
config :xperiments, Xperiments.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "wmyoXASvGJLg451QAYP78cyDkFi9d5MEDmG73goFsFdzg0cnSYxYxcWptWjqHjBs",
  render_errors: [view: Xperiments.ErrorView, accepts: ~w(json)],
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

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
