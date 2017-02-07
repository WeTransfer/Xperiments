defmodule Xperiments.Assigner.ManagerTest do
  use Xperiments.AssignCase, async: false
  alias Xperiments.Assigner.{Manager}

  setup do
    on_exit fn ->
      # terminate all experiments
      for e_pid <- Manager.experiments_list() do
        Supervisor.terminate_child(Xperiments.Assigner.Supervisor, e_pid)
      end
    end
    [
      exp: insert(:experiment, state: "running") |> Repo.preload(:exclusions)
    ]
  end

  test "return an error when we try to start an experiment with a wrong state" do
    exp = insert(:experiment, state: "draft") |> Repo.preload(:exclusions)
    {:error, reason} = Manager.start_experiment(exp)
    assert {:bad_experiment, exp} == reason
  end

  test "start a new experiment", context do
    {:ok, pid} = Manager.start_experiment(context.exp)
    assert is_pid(pid)
    assert length(Manager.experiments_list()) == 1
  end

  test "terminate an experiment", context do
    {:ok, _} = Manager.start_experiment(context[:exp])
    assert length(Manager.experiments_list()) == 1
    Manager.terminate_experiment(context.exp.id)
    assert length(Manager.experiments_list()) == 0
  end
end
