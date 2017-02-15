defmodule Xperiments.Assigner.DispatcherTest do
  use Xperiments.AssignCase
  alias Xperiments.Assigner.{ExperimentSupervisor, Experiment, Dispatcher}

  setup do
    for e_pid <- ExperimentSupervisor.experiment_pids() do
      Supervisor.terminate_child(ExperimentSupervisor, e_pid)
    end
    app = insert(:application, name: "web")
    excluded_exps = insert_list(2, :experiment, application: app, state: "running")
    exp =
      insert(:experiment, state: "running", exclusions: excluded_exps)
      |> Repo.preload(:exclusions)
    Enum.map(excluded_exps, fn e ->
      e |> Xperiments.Repo.preload(:exclusions)
      |> ExperimentSupervisor.start_experiment()
    end)
    ExperimentSupervisor.start_experiment(exp)
    [exp: exp, excluded_exps: excluded_exps, app: app]
  end

  def run_new_experiments(app) do
    new_exps = insert_list(3, :experiment, application: app, state: "running")
    Enum.map(new_exps, fn e ->
      Xperiments.Repo.preload(e, :exclusions)
      |> ExperimentSupervisor.start_experiment()
    end)
    new_exps
  end

  test "returning of experiments for an empty request without excluded experiments" do
    response = Dispatcher.get_suitable_experiments([], %{})
    assert length(response.assign) == 1
  end

  test "returning of experiments for a request with assigned experiment", context do
    response = Dispatcher.get_suitable_experiments([], %{})
    assert length(response.assign) == 1
    run_new_experiments(context.app)
    exp = List.first(response.assign)
    exp_id = exp.id
    var_id = exp.variant.id
    new_response = Dispatcher.get_suitable_experiments([], %{exp_id => var_id})
    assert length(new_response.assign) == 4
  end

  test "returning of unassigned experiments and assign those, which were excluded" do
    response = Dispatcher.get_suitable_experiments([], %{})
    exp = List.first(response.assign)
    exp_id = exp.id
    var_id = exp.variant.id
    ExperimentSupervisor.get_experiment_pids_by_ids(exp_id)
    |> List.first
    |> GenServer.stop()
    :timer.sleep 100 # yeah, we need to wait, until Registry reeives the message about killed process
    new_response = Dispatcher.get_suitable_experiments([], %{exp_id => var_id})
    assert length(new_response.unassign) == 1
    assert length(new_response.assign) == 2
  end
end
