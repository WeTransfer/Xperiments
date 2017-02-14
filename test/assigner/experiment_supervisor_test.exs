defmodule Xperiments.Assigner.ExperimentSupervisorTest do
  use Xperiments.AssignCase, async: false
  import ExUnit.CaptureLog
  alias Xperiments.Assigner.{ExperimentSupervisor}

  setup do
    for e_pid <- ExperimentSupervisor.experiments_list() do
      Supervisor.terminate_child(ExperimentSupervisor, e_pid)
    end
    [
      exp: insert(:experiment, state: "running") |> Repo.preload(:exclusions)
    ]
  end

  test "return an error when we try to start an experiment with a wrong state" do
    exp = insert(:experiment, state: "draft") |> Repo.preload(:exclusions)
    assert capture_log(fn ->
      :error = ExperimentSupervisor.start_experiment(exp)
      end) =~ "Given experiment"
  end

  test "start a new experiment", context do
    {:ok, pid} = ExperimentSupervisor.start_experiment(context.exp)
    assert is_pid(pid)
    assert length(ExperimentSupervisor.experiments_list()) == 1
  end

  test "terminate an experiment", context do
    {:ok, _} = ExperimentSupervisor.start_experiment(context[:exp])
    assert length(ExperimentSupervisor.experiments_list()) == 1
    ExperimentSupervisor.terminate_experiment(context.exp.id)
    assert length(ExperimentSupervisor.experiments_list()) == 0
  end
end
