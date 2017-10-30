defmodule XperimentsWeb.V1.ExperimentController do
  use XperimentsWeb, :controller
  alias Xperiments.Experiments
  alias Xperiments.Experiments.Exclusion
  alias Xperiments.BroadcastService

  action_fallback XperimentsWeb.V1.FallbackController

  plug :scrub_params, "experiment" when action in [:create, :update]
  plug :get_current_application when action in [:index, :create, :update]
  plug :get_current_user

  def index(conn, _params) do
    with :ok <- Bodyguard.permit(Experiments, :get_experiments_for_app, conn.assigns.current_user) do
      experiments = Experiments.get_experiments_for_app(conn.assigns.application)
      render(conn, "index.json", experiments: experiments)
    end
  end

  def show(conn, %{"id" => id}) do
    experiment = Experiments.get_experiment(id)
    with :ok <- Bodyguard.permit(Experiments, :get_experiment, conn.assigns.current_user, experiment) do
      render(conn, "show.json", experiment: experiment)
    end
  end

  def create(conn, %{"experiment" => params}) do
    current_user = conn.assigns.current_user
    with :ok <- Bodyguard.permit(Experiments, :create_experiment, current_user),
         {:ok, exp} <- Experiments.create_experiment(params, current_user, conn.assigns.application) do
      exp = Map.merge(exp, %{exclusions: Experiments.get_exclusions_for_experiment(exp.id)})
      conn
      |> put_status(:created)
      |> render("show.json", experiment: exp)
    end
  end

  def update(conn, %{"id" => id, "experiment" => updates}) do
    with {:ok, exp} <- Experiments.update_experiment(id, updates, conn.assigns.application),
         :ok <- Bodyguard.permit(Experiments, :update_experiment, conn.assigns.current_user, exp) do
      exp = Map.merge(exp, %{exclusions: Exclusion.for_experiment(exp.id)})
      render(conn, "show.json", experiment: exp)
    end
  end

  def change_state(conn, %{"experiment_id" => id, "event" => event}) do
    with :ok <- Experiments.is_allowed_event(event),
         {:ok, exp, old_state} <- Experiments.change_experiment_state(id, event),
         :ok <- Bodyguard.permit(Experiments, :change_experiment_state, conn.assigns.current_user, exp) do
      exp = Map.merge(exp, %{exclusions: Experiments.get_exclusions_for_experiment(exp.id)})
      BroadcastService.broadcast_state_changes(old_state, exp.state, exp)
      render(conn, "state.json", state: exp.state)
    end
  end

  def exclusions(conn, %{"experiment_id" => id}) do
    with :ok <- Bodyguard.permit(Experiments, :get_exclusions_for_experiment, conn.assigns.current_user, id) do
      exclusions = Experiments.get_exclusions_for_experiment(id)
      render conn, "exclusions.json", exclusions: exclusions, id: id
    end
  end

  def variant(conn, %{"experiment_id" => e_id, "variant_id" => var_id}) do
    with :ok <- Bodyguard.permit(Experiments, :get_variant_of_experiment, conn.assigns.current_user, e_id),
         {:ok, variant} <- Experiments.get_variant_of_experiment(e_id, var_id) do
      render(conn, XperimentsWeb.V1.VariantView, "show.json", variant: variant)
    end
  end

  #
  # Private
  #

  defp get_current_application(conn, _params) do
    app_name = conn.params["application_name"]
    with {:ok, app} <- Xperiments.Cms.get_application(app_name) do
      assign(conn, :application, app)
    else
      {:error, :application_not_found, name} ->
        err_message = "The application #{name} doesn't exists"
        put_status(conn, :unprocessable_entity)
        |> render(XperimentsWeb.V1.ErrorView, "common_error.json", %{error: %{application: err_message}})
        |> halt()
    end
  end

  #
  # Private
  #

  defp get_current_user(conn, _params) do
    current_user = Guardian.Plug.current_resource(conn, :default)
    assign(conn, :current_user, current_user)
  end
end
