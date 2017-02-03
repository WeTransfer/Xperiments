defmodule Xperiments.ExperimentController do
  use Xperiments.Web, :controller
  alias Xperiments.{Experiment, Application}

  plug :scrub_params, "experiment" when action in [:create, :update]

  def index(conn, %{"application_name" => app}) do
    app = Repo.get_by!(Application, name: app) |> Repo.preload(:experiments)
    render(conn, "index.json", experiments: app.experiments |> Repo.preload(:exclusions))
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

  def update(conn, %{"id" => id, "experiment" => updates}) do
    exp = Repo.get!(Experiment, id)
    changeset = Experiment.changeset_update(exp, updates)

    case Repo.update(changeset) do
      {:ok, exp} ->
        exp = Repo.preload(exp, :exclusions)
        render(conn, "show.json", experiment: exp)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(RestApi.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def change_state(conn, %{"experiment_id" => id, "event" => event}) do
    experiment = Repo.get!(Experiment, id)
    changeset = case event do
                  "run" ->
                    Experiment.run(experiment)
                  "stop" ->
                    Experiment.stop(experiment)
                  "terminate" ->
                    Experiment.terminate(experiment)
                  "delete" ->
                    Experiment.delete(experiment)
                  _ ->
                    "Unsupported state"
                    halt(conn)
                end
    case Repo.update(changeset) do
      {:ok, exp} ->
        render(conn, "state.json", state: exp.state)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(RestApi.ChangesetView, "error.json", changeset: changeset)
    end
  end
end
