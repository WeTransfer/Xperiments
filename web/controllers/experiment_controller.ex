defmodule Xperiments.ExperimentController do
  use Xperiments.Web, :controller
  alias Xperiments.{Experiment, Exclusion, Application}
  alias Xperiments.Services.BroadcastService

  plug :scrub_params, "experiment" when action in [:create, :update]
  plug :get_application when action in [:index, :create, :update]

  def index(conn, _params) do
    experiments =
      Experiment.all_for_application(conn.assigns.application)
      |> Repo.all
      |> Enum.map(fn ex -> Map.merge(ex, %{exclusions: Exclusion.for_experiment(ex.id)}) end)

    render(conn, "index.json", experiments: experiments)
  end

  def show(conn, %{"id" => id}) do
    experiment =
      Repo.get!(Experiment, id)
      |> Map.merge(%{exclusions: Exclusion.for_experiment(id)})
    render(conn, "show.json", experiment: experiment)
  end

  def create(conn, %{"experiment" => experiment_data}) do
    changeset =
      Experiment.changeset(%Experiment{}, experiment_data)
      |> Ecto.Changeset.put_assoc(:application, conn.assigns.application)

    case Repo.insert(changeset) do
      {:ok, exp} ->
        exp = Map.merge(exp, %{exclusions: Exclusion.for_experiment(exp.id)})
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

    {exclusions, updates} = Map.pop(updates, "exclusions", [])
    # NOTE: Maybe unnecessary step now
    exclusions =
      Experiment.avialable_experiments_for_exclsions(conn.assigns.application, exclusions)
      |> Repo.all()
    changeset = Experiment.changeset_update(exp, updates)

    # TODO: Use Multi to use all changes in one transaction and handle results
    Exclusion.update_exclusions(id, Enum.map(exclusions, & &1.id))

    case Repo.update(changeset) do
      {:ok, exp} ->
        exp = Map.merge(exp, %{exclusions: Exclusion.for_experiment(exp.id)})
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
          exp = Map.merge(exp, %{exclusions: Exclusion.for_experiment(exp.id)})
          BroadcastService.broadcast_state_changes(changeset.data.state, changeset.changes.state, exp)
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
    exclusions = Exclusion.for_experiment(id)
    render conn, "exclusions.json", exclusions: exclusions, id: id
  end

  def variant(conn, %{"experiment_id" => e_id, "variant_id" => var_id}) do
    exp =
      Experiment
      |> Repo.get!(e_id)
    case Enum.find(exp.variants, &(&1.id == var_id)) do
      nil ->
        msg = "Variant with id '#{var_id}' for the experiment with id '#{e_id}' is not found"
        put_status(conn, :not_found)
        |> render(Xperiments.ErrorView, "common_error.json", %{error: %{experiment: msg}})
      var ->
        render(conn, Xperiments.VariantView, "show.json", variant: var)
    end
  end

  defp get_application(conn, _params) do
    app_name = conn.params["application_name"]
    case Repo.get_by(Application, name: app_name) do
      nil ->
        err_message = "The application #{app_name} doesn't exists"
        put_status(conn, :unprocessable_entity)
        |> render(Xperiments.ErrorView, "common_error.json", %{error: %{application: err_message}})
        |> halt()
      app ->
        assign(conn, :application, app)
    end
  end
end
