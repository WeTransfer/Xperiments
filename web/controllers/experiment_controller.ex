defmodule Xperiments.ExperimentController do
  use Xperiments.Web, :controller
  alias Xperiments.{Experiment, Application}

  plug :scrub_params, "experiment" when action in [:create, :update]

  def index(conn, params) do

  end

  def create(conn, %{"application_name" => app, "experiment" => experiment_data}) do
    app = Repo.get_by!(Application, name: app)
    changeset =
      Experiment.changeset(%Experiment{}, experiment_data)
      |> Ecto.Changeset.put_assoc(:application, app)

    case Repo.insert(changeset) do
      {:ok, exp} ->
        exp = Repo.preload(exp, :exclusions)
        conn
        |> put_status(:created)
        |> render("show.json", experiment: exp)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json", changeset: changeset)
    end
  end

  def udpdate(conn, params) do

  end
end
