defmodule Xperiments.Plug.RateLimitTest do
  def init(_), do: :ok
  def call(conn, _opts), do: conn
end
