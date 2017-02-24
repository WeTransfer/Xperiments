defmodule Xperiments.AuthController do
  @moduledoc """
  Auth controller responsible for handling Ueberauth responses
  """
  use Xperiments.Web, :controller
  alias Xperiments.User

  plug Ueberauth

  def callback(%{assigns: %{ueberauth_failure: _fails}} = conn, _params) do
    conn
    |> redirect(to: "/")
  end

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    case User.find_or_create(auth) do
      {:ok, user} ->
        conn
        |> Guardian.Plug.sign_in(user)
        |> redirect(to: "/")
      {:error, reason} ->
        conn
        |> put_status(401)
        |> render(Xperiments.ErrorView, "common_error.json", message: "Could not login with the reason: #{reason}")
    end
  end

end
