defmodule Xperiments.Assigner.ManagerTest do
  use Xperiments.AssignCase, async: false
  alias Xperiments.Assigner.{Manager, Supervisor}

  setup do
    [
      exp: insert(:experiment) |> Repo.preload(:exclusions)
    ]
  end

  test "start a new experiment", context do
    {:ok, pid} = Manager.start_experiment(context[:exp])
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
