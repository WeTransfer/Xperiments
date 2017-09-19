defmodule Xperiments do
  use Application

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec

    # Define workers and child supervisors to be supervised
    children = [
      supervisor(Xperiments.Repo, []),
      worker(Hammer.Backend.Redis, [[expiry_ms: 1000 * 60 * 60,
                                     redix_config: Application.get_env(:xperiments, :redis_url)]]),
      supervisor(Xperiments.Web.Endpoint, []),
      supervisor(Xperiments.Assigner.Supervisor, [])
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Xperiments.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    Xperiments.Web.Endpoint.config_change(changed, removed)
    :ok
  end
end
