defmodule Xperiments.ExperimentController do
  use Xperiments.Web, :controller
  alias Xperiments.{Experiment, Application}

  plug :scrub_params, "experiment" when action in [:create, :update]
  plug :get_application when action in [:index, :create, :update]

  def index(conn, _params) do
    experiments =
      Experiment.all_for_application(conn.assigns.application)
      |> Experiment.with_exclusions
      |> Repo.all
    render(conn, "index.json", experiments: experiments)
  end

  def show(conn, %{"id" => id}) do
    experiment =
      Experiment.with_exclusions(Experiment)
      |> Repo.get!(id)
    render(conn, "show.json", experiment: experiment)
  end

  def create(conn, %{"experiment" => experiment_data}) do
    changeset =
      Experiment.changeset(%Experiment{}, experiment_data)
      |> Ecto.Changeset.put_assoc(:application, conn.assigns.application)

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

  def update(conn, %{"id" => id, "experiment" => updates} = params) do
    exp = Repo.get!(Experiment, id)
    changeset = Experiment.changeset_update(exp, updates)

    # exclusions_ids = params["exclusion_ids"] || []
    # exclusions = Repo.all(Experiment.experiments_for_exclusions)
    # changeset = put_assoc(changeset, :exclusions, exclusions)

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

  def exclusions(conn, %{"experiment_id" => id}) do
    experiment =
      Experiment
      |> Experiment.with_exclusions
      |> Repo.get(id)
    render conn, "exclusions.json", exclusions: experiment.exclusions, id: experiment.id
  end

  defp get_application(conn, params) do
    app_name = conn.params["application_name"]
    case Repo.get_by!(Application, name: app_name) do
      nil ->
        err_message = "The application #{app_name} doesn't exists"
        render(conn, Xperiments.ErrorView, "common_error.json", %{application: err_message})
        |> halt()
      app ->
        assign(conn, :application, app)
    end
  end

end
