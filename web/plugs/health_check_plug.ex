defmodule HealthCheckPlug do
  import Plug.Conn

  def init(opts \\ %{}), do: Enum.into(opts, %{})

  def call(conn, _) do
    send_resp(conn, 200, "")
  end
end
