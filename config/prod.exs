use Mix.Config

config :xperiments, Xperiments.Endpoint,
  http: [port: 8080],
  url: [host: {:system, "HOST", "xperiments.wetransfer.net"}, port: 80],
  cache_static_manifest: "priv/static/manifest.json",
  server: true,
  root: ".",
  version: Mix.Project.config[:version]

config :xperiments, :cors,
  origin: ~r/http(s)?.*wetransfer\d?\.com|http(s)?.*wtd0\d?\.com|http(s)?.*wetransferbeta\.com$/

# Do not print debug messages in production
config :logger, level: :info

config :ueberauth, Ueberauth.Strategy.Google.OAuth,
  client_id: "${GOOGLE_CLIENT_ID}",
  client_secret: "${GOOGLE_CLIENT_SECRET}",
  redirect_uri: "${GOOGLE_OAUTH_CALLBACK}"

config :xperiments, Xperiments.Endpoint,
  secret_key_base: "${SECRET_KEY_BASE}"

config :guardian, Guardian,
  secret_key: "${SECRET_KEY_BASE}"

config :xperiments, Xperiments.Repo,
  adapter: Ecto.Adapters.Postgres,
  url: "${DB_URL}",
  pool_size: 20
