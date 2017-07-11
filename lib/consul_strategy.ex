defmodule Cluster.Strategy.Consul do
  @moduledoc """
  This clustering strategy uses Consul to load all nodes of a specific service.
  It uses Consul Services, which have built in health checker, so dead nodes will be automatically
  removed from a cluster. To use this possibility an application shuold have endpoint `/healthckeck`
  and response status 200.

  TODO: Explanation how Consul Service definitation should be specified.

  An example configuration is below:

      config :libcluster,
        topologies: [
          consul_example: [
            strategy: #{__MODULE__},
            config: [
              consul_url: "http://localhost:8500/v1/catalog/service/", # optional
              service: "myapp",
              env: Mix.env
            ]
          ]
        ]

  """
  use GenServer
  use Cluster.Strategy
  import Cluster.Logger

  alias Cluster.Strategy.State

  @default_consul_url "http://localhost:8500/v1/catalog/service/"
  @default_polling_time 10_000
  @retry_ms 15_000
  @attempts 50

  def start_link(opts), do: GenServer.start_link(__MODULE__, opts)
  def init(opts) do
    HTTPoison.start
    state = %State{
      topology:   Keyword.fetch!(opts, :topology),
      connect:    Keyword.fetch!(opts, :connect),
      disconnect: Keyword.fetch!(opts, :disconnect),
      list_nodes: Keyword.fetch!(opts, :list_nodes),
      config:     Keyword.fetch!(opts, :config)
    }
    meta = %{
      service:    Keyword.fetch!(state.config, :service),
      consul_url: Keyword.get(state.config, :consul_fetch, @default_consul_url),
      env:        Keyword.fetch!(state.config, :env),
    }
    {:ok, %{state | meta: meta}, 0}
  end

  def handle_info(:timeout, state), do: handle_info(:polling, state)
  def handle_info(:polling, %State{meta: meta} = state) do
    debug state.topology, "polling"
    service_url = URI.merge(meta.consul_url, meta.service) |> to_string
    task = Task.async(__MODULE__, :check_service, [service_url, meta.env])
    Process.send_after(self(), :polling, :rand.uniform(@default_polling_time))
    {:noreply, Map.put(state, :task, task)}
  end

  # Handling results from service checking task
  def handle_info({ref, results}, %{task: %Task{ref: ref}, connect: connect, list_nodes: list_nodes} = state) do
    case results do
      {:ok, new_list} ->
        debug state.topology, "received a response from Consul"
        Cluster.Strategy.connect_nodes(state.topology, connect, list_nodes, new_list)
        {:noreply, state}
      :error ->
        {:noreply, state, @retry_ms}
    end
  end
  # Poller completed
  def handle_info({:DOWN, ref, _, _, :normal}, state) do
    {:noreply, state}
  end

  @spec check_service(binary, binary) :: {:ok, list} | :error
  def check_service(service_url, env) do
    debug __MODULE__, "getting data from: #{service_url}"
    case HTTPoison.get(service_url) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        {:ok, parse_response(body, env)}
      {:ok, %HTTPoison.Response{status_code: 404}} ->
        debug __MODULE__, "URL not found :("
        :error
      {:error, %HTTPoison.Error{reason: reason}} ->
        debug __MODULE__, "Error with the reason: #{reason}"
        :error
    end
  end

  #
  # Private
  #

  defp parse_response(response, env) do
    filter = fn(el) -> hd(el["ServiceTags"]) == to_string(env) end
    mapper = fn(el) -> el["ServiceID"] <> "@" <> el["Address"] end
    Poison.decode!(response)
    |> Enum.filter_map(filter, mapper)
  end
end
