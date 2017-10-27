defmodule XperimentsWeb.AssignerController do
  use XperimentsWeb, :controller
  alias Xperiments.{Repo, Experiment}

  plug Xperiments.Plug.RateLimit, max_requests: 5, interval_seconds: 60
  plug :auth_request when action in [:example]

  def experiments(conn, params) do
    experiments = Xperiments.Assigner.Dispatcher.get_suitable_experiments(
      params["segments"], params["assigned"])
    render conn, "experiments.json", experiments: experiments
  end

  def events(conn, %{"event" => "impression", "payload" => payload}) do
    Xperiments.BroadcastService.broadcast_impression(payload["experiment_id"], payload["variant_id"])
    put_status(conn, 200)
    |> json(%{})
  end

  def example(conn, %{"id" => id, "variant_id" => var_id}) do
    experiment = Repo.get!(Experiment, id)
    variant = Enum.find(experiment.variants, & &1.id == var_id)
    render conn, "example.json", experiment: experiment, variant: variant
  end

  def auth_request(conn, _opts) do
    salt = Application.get_env(:xperiments, XperimentsWeb.Endpoint)[:secret_key_base]
    case Phoenix.Token.verify(XperimentsWeb.Endpoint, salt, conn.params["token"]) do
      {:ok, _} -> conn
      {:error, _} ->
        conn
        |> put_status(:forbidden)
        |> json(%{error: "Access denied"})
        |> halt()
    end
  end

end
