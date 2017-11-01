defmodule XperimentsWeb.V1.FallbackController do
  use Phoenix.Controller
  alias XperimentsWeb.V1.ErrorView

  def call(conn, {:error, :bad_request}) do
    conn
    |> put_status(:bad_request)
    |> json(%{errors: %{details: "unsupported event"}})
  end

  def call(conn, {:error, :experiment_not_found, [e_id, var_id]}) do
    msg = "Variant with id '#{var_id}' for the experiment with id '#{e_id}' is not found"
    put_status(conn, :not_found)
    |> render(XperimentsWeb.V1.ErrorView, "common_error.json", %{error: %{experiment: msg}})
  end

  def call(conn, {:error, :unauthorized}) do
    conn
    |> put_status(:forbidden)
    |> render(ErrorView, :"403")
  end


  def call(conn, {:error, changeset, _}),
    do: call(conn, {:error, changeset})
  def call(conn, {:error, changeset}) do
    conn
    |> put_status(:unprocessable_entity)
    |> render(ErrorView, "error.json", changeset: changeset)
  end
end
