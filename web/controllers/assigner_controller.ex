defmodule Xperiments.AssignerController do
  use Xperiments.Web, :controller
  alias Xperiments.{Repo, Experiment}

  plug Xperiments.Plug.RateLimit, max_requests: 5, interval_seconds: 60

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

  # This one only for testing purpose
  # TODO: don't forget to chech auth
  def example(conn, %{"id" => id, "variant_id" => var_id}) do
    experiment = Repo.get!(Experiment, id)
    variant = Enum.find(experiment.variants, & &1.id == var_id)
    render conn, "example.json", experiment: experiment, variant: variant
  end
end
