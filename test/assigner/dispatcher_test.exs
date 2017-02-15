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
    [exp: exp, excluded_exps: excluded_exps]
  end

  def run_new_experiments(app) do
    new_exps = insert_list(3, :experiment, application: app, state: "running")
    Enum.map(new_exps, & ExperimentSupervisor.start_experiment/1)
    new_exps
  end

  test "returning of experiments for an empty request" do
    response = Dispatcher.get_suitable_experiments([], %{})
    assert length(response.assign) == 1
  end
end
