defmodule Xperiments.Assigner.LoaderTest do
  use Xperiments.AssignCase, async: false
  alias Xperiments.Assigner

  setup do
    for e_pid <- Assigner.ExperimentSupervisor.experiments_list() do
      Supervisor.terminate_child(Assigner.ExperimentSupervisor, e_pid)
    end
    app = insert(:application, name: "frontend")
    runned_exps = insert_list(4, :experiment, application: app, state: "running")
    insert_list(3, :experiment, application: app, exclusions: runned_exps ) # draft state
    :ok
  end

  test "load experiment in a `running` state only and run them" do
    list = Assigner.ExperimentSupervisor.experiments_list()
    assert length(list) == 0
    Assigner.Loader.load_experiments_from_db()
    list = Assigner.ExperimentSupervisor.experiments_list()
    assert length(list) == 4
  end
end
