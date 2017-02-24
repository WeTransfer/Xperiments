defmodule Xperiments.Plug.RefreshJwtToken do
  import Plug.Conn
  require Logger

  def init(opts \\ %{}), do: Enum.into(opts, %{})

  def call(conn, _) do
    if Guardian.Plug.authenticated?(conn) do
      existing_jwt = Guardian.Plug.current_token(conn)
      case Guardian.refresh!(existing_jwt) do
        {:ok, new_jwt, new_claims} ->
          the_key = Map.get(new_claims, :key, :default)
          put_session(conn, Guardian.Keys.base_key(the_key), new_jwt)
        {:error, reason} ->
          Logger.error "Error when trying to refresh a token with the reason: #{reason}"
          conn
      end
    else
      conn
    end
  end
end
