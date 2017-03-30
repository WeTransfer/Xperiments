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
    exp = insert(:experiment, state: "draft")
    assert capture_log(fn ->
      :error = ExperimentSupervisor.start_experiment(exp)
      end) =~ "Given experiment is not started"
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

  test "change a state to 'terminated' in a DB when trying to load invalid experiment" do
    err_fun = fn ->
      exp = insert(:experiment, state: "running", end_date: Timex.shift(Timex.now, days: -1))
      :error = ExperimentSupervisor.start_experiment(exp)
      :timer.sleep 30
      db_exp = Xperiments.Repo.get!(Xperiments.Experiment, exp.id)
      assert db_exp.state == "terminated"
    end
    assert capture_log(err_fun) =~ "Given experiment is not started"
  end

  # test "returning pids of children in order sorted by priority" do
  #   use Timex
  #   datetime = fn (d) -> Timex.shift(Timex.now, days: d) end
  #   exp = insert(:experiment, state: "running", inserted_at: datetime.(1))
  #   exp1 = insert(:experiment, state: "running", inserted_at: datetime.(2))
  #   exp2 = insert(:experiment, state: "running", inserted_at: datetime.(3))
  #   {:ok, pid2} = ExperimentSupervisor.start_experiment(exp2)
  #   {:ok, pid} = ExperimentSupervisor.start_experiment(exp)
  #   {:ok, pid1} = ExperimentSupervisor.start_experiment(exp1)
  #   pids = ExperimentSupervisor.experiment_pids()
  #   assert pids == [pid2, pid1, pid]
  # end
end
