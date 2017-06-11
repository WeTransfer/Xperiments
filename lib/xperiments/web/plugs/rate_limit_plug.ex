defmodule Xperiments.Plug.RateLimit do
  import Phoenix.Controller, only: [json: 2]
  import Plug.Conn
  require Logger

  def init(opts), do: opts

  def call(conn, options \\ []) do
    case check_rate(conn, options) do
      {:ok, _count}   -> conn # Do nothing, allow execution to continue
      {:error, _count} -> render_error(conn)
    end
  end

  defp check_rate(conn, options) do
    interval_milliseconds = options[:interval_seconds] * 1000
    max_requests = options[:max_requests]
    ExRated.check_rate(bucket_name(conn), interval_milliseconds, max_requests)
  end

  # Bucket name should be a combination of ip address and request path, like so:
  #
  # "127.0.0.1:/api/v1/authorizations"
  defp bucket_name(conn) do
    path = Enum.join(conn.path_info, "/")
    ip   = conn.remote_ip |> Tuple.to_list |> Enum.join(".")
    "#{ip}:#{path}"
  end

  defp render_error(conn) do
    Logger.warn "Rate limit exceeded for the IP address: #{inspect conn.remote_ip}"
    conn
    |> put_status(:forbidden)
    |> json(%{error: "Rate limit exceeded"})
    |> halt() # Stop execution of further plugs, return response now
  end
end
