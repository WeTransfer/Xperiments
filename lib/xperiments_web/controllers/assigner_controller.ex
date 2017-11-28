defmodule XperimentsWeb.AssignerController do
  use XperimentsWeb, :controller
  alias Xperiments.Repo
  alias Xperiments.Experiments.Experiment

  plug Application.get_env(:xperiments, :rate_limiter), max_requests: 5, interval_seconds: 60
  plug :auth_request when action in [:example]
  plug :reject_on_empty_segments when action in [:experiments]
  plug :parse_ua when action in [:experiments]

  def experiments(conn, params) do
    segments = merge_segments_with_parsed_ua(params["segments"], Map.get(conn.assigns, :parsed_ua))
    experiments = Xperiments.Assigner.Dispatcher.get_suitable_experiments(
      segments, params["assigned"])
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

  #
  # Private
  #

  defp reject_on_empty_segments(%{params: params} = conn, _opts) do
    segments = Map.get(params, "segments")
    if is_nil(segments) or map_size(segments) == 0 do
      conn
      |> put_status(:no_content)
      |> halt()
    else
      conn
    end
  end

  defp merge_segments_with_parsed_ua(segments, nil), do: segments
  defp merge_segments_with_parsed_ua(segments, parsed_ua), do: Map.merge(segments, parsed_ua)

  defp parse_ua(%{params: %{"user_agent" => user_agent}} = conn, _opts) do
    parsed_ua = UAParser.parse(user_agent) |> prepare_parsed_ua()
    assign(conn, :parsed_ua, parsed_ua)
  end
  defp parse_ua(conn, _opts), do: conn


  defp prepare_parsed_ua(nil), do: %{}
  defp prepare_parsed_ua(%UAParser.UA{family: nil}), do: %{}
  defp prepare_parsed_ua(%UAParser.UA{family: browser,
                                      os: %UAParser.OperatingSystem{family: os},
                                      version: version}),
    do: %{"platform" => os, "browser" => browser, "version" => to_string(version)}
end
