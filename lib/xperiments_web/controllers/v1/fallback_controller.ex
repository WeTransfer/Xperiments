defmodule XperimentsWeb.V1.FallbackController do
  use Phoenix.Controller
  alias XperimentsWeb.V1.ErrorView

  def call(conn, {:error, changeset}) do
    conn
    |> put_status(:unprocessable_entity)
    |> render(ErrorView, "error.json", changeset: changeset)
  end

end
