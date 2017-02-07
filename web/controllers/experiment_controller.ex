defmodule Xperiments.ExperimentController do
  use Xperiments.Web, :controller
  alias Xperiments.{Experiment, Application}

  plug :scrub_params, "experiment" when action in [:create, :update]

  def index(conn, %{"application_name" => app}) do
    app =
      Repo.get_by!(Application, name: app)
      |> Repo.preload(experiments: from(e in Experiment, where: e.state != "deleted"))
    render(conn, "index.json", experiments: app.experiments |> Repo.preload(:exclusions))
  end

  def show(conn, %{"id" => id}) do
    experiment =
      Repo.get!(Experiment, id)
      |> Repo.preload(:exclusions)
    render(conn, "show.json", experiment: experiment)
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
        |> render(Xperiments.ErrorView, "error.json", changeset: changeset)
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
        |> render(Xperiments.ErrorView, "error.json", changeset: changeset)
    end
  end

  def change_state(conn, %{"experiment_id" => id, "event" => event}) do
    experiment = Repo.get!(Experiment, id)
    if String.to_atom(event) in Experiment.events do
      changeset = Experiment.change_state(experiment, event)
      case Repo.update(changeset) do
        {:ok, exp} ->
          render(conn, "state.json", state: exp.state)
        {:error, changeset} ->
          conn
          |> put_status(:unprocessable_entity)
          |> render(Xperiments.ErrorView, "error.json", changeset: changeset)
      end
    else
      conn
      |> put_status(:bad_request)
      |> json(%{errors: %{details: "unsupported event"}})
    end
  end
end
