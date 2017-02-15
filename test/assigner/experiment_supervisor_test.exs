defmodule Xperiments.Assigner.ExperimentSupervisorTest do
  use Xperiments.AssignCase, async: false
  import ExUnit.CaptureLog
  alias Xperiments.Assigner.{ExperimentSupervisor}

  setup do
    for e_pid <- ExperimentSupervisor.experiment_pids() do
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
    assert length(ExperimentSupervisor.experiment_pids()) == 1
  end

  test "terminate an experiment", context do
    {:ok, _} = ExperimentSupervisor.start_experiment(context[:exp])
    assert length(ExperimentSupervisor.experiment_pids()) == 1
    ExperimentSupervisor.terminate_experiment(context.exp.id)
    assert length(ExperimentSupervisor.experiment_pids()) == 0
  end

  test "returning pids of children in order sorted by priority", context do
    use Timex
    :timer.sleep 100
    exp1 = insert(:experiment, state: "running")
    :timer.sleep 100
    exp2 = insert(:experiment, state: "running")
    :timer.sleep 100
    {:ok, pid2} = ExperimentSupervisor.start_experiment(exp2)
    {:ok, pid} = ExperimentSupervisor.start_experiment(context.exp)
    {:ok, pid1} = ExperimentSupervisor.start_experiment(exp1)
    pids = ExperimentSupervisor.experiment_pids()
    assert pids == [pid2, pid1, pid]
  end
end
