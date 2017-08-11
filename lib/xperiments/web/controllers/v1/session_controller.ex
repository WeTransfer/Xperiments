defmodule Xperiments.Web.V1.SessionController do
  @moduledoc """
  The module creates a user session
  """
  use Xperiments.Web, :controller
  alias Xperiments.User
  alias Xperiments.Web.V1.ErrorView

  def create(conn, params) do
    case User.find_and_confirm_password(params) do
      {:ok, user} ->
        conn
        |> Guardian.Plug.sign_in(user)
        |> put_status(:created)
        |> json("")
      {:error, reason} ->
        conn
        |> put_status(:forbidden)
        |> render(ErrorView, "common_error.json", error: reason)
    end
  end

  def delete(conn, _params) do
    Guardian.Plug.sign_out(conn)
    |> put_status(:no_content)
    |> json("")
  end
end
