use Mix.Config

config :xperiments, Xperiments.Endpoint,
  http: [port: {:system, "PORT", "8080"}],
  url: [host: {:system, "HOST", "xperiments.wetransferbeta.com"}, port: 80],
  cache_static_manifest: "priv/static/manifest.json",
  server: true,
  root: ".",
  version: Mix.Project.config[:version]

config :xperiments, :cors,
  origin: ~r/http(s)?.*wetransfer\d?\.com|http(s)?.*wtd0\d?\.com|http(s)?.*wetransferbeta\.com$/

# Do not print debug messages in production
config :logger, level: :debug

config :ueberauth, Ueberauth.Strategy.Google.OAuth,
  redirect_uri: "https://xperiments.wetransferbeta.com"

config :xperiments, Xperiments.Endpoint,
  secret_key_base: {:system, "SECRET_KEY_BASE"}

config :guardian, Guardian,
  secret_key: {:system, "SECRET_KEY_BASE"}

config :xperiments, Xperiments.Repo,
  adapter: Ecto.Adapters.Postgres,
  url: {:system, "DB_URL"},
  pool_size: 20
