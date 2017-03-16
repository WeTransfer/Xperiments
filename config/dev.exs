use Mix.Config

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we use it
# with brunch.io to recompile .js and .css sources.
config :xperiments, Xperiments.Endpoint,
  http: [port: 5000],
  debug_errors: true,
  code_reloader: true,
  check_origin: false,
  watchers: [npm: ["run", "watch"]]

config :xperiments, :js_config,
  reporting_url: "https://analytics.google.com/analytics/web/?authuser=1#my-reports/5IyMQAn0Tcqdu2Va8V9BIg/a69714416w130256140p134086343/%3F_u.date00%3D20170227%26_u.date01%3D20170227%26_u.sampleOption%3Dmoreprecision%26_u.sampleSize%3D500000/"


# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development. Avoid configuring such
# in production as building large stacktraces may be expensive.
config :phoenix, :stacktrace_depth, 20

# Configure your database
config :xperiments, Xperiments.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "xperiments_dev",
  hostname: "localhost",
  pool_size: 10
