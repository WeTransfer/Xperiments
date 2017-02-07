defmodule Xperiments.Assigner.ExperimentTest do
  use Xperiments.AssignCase, async: false
  alias Xperiments.Assigner.{Manager, Supervisor}

  setup do
    exp = insert(:experiment) |> Repo.preload(:exclusions)
    Manager.start_experiment(exp)
    [exp: exp]
  end

  test "stop an experiment (change a status to `stopped`)", context do
    Experiment.stop(context.exp.id)
  end
end
