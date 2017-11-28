defmodule Xperiments.RateLimitPlugTest do
  use ExUnit.Case, async: true
  import Plug.Test
  alias Xperiments.Plug.RateLimit

  @opts RateLimit.init([max_requests: 1, interval_seconds: 2])

  test "throttles requests" do
    conn = conn(:post, "/assigner/application/test_app/experiments/", %{"segments" => %{"lang" => "br"}})

    conn = RateLimit.call(conn, @opts)
    assert conn.state == :unset
    assert conn.status == nil

    # We reach a givin limit
    conn = RateLimit.call(conn, @opts)
    assert conn.state == :sent
    assert conn.status == 403
  end
end
