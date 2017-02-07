defmodule Xperiments.Assigner.ExperimentTest do
  use Xperiments.AssignCase, async: false
  alias Xperiments.Assigner.{Manager, Experiment}

  setup do
    exp =
      insert(:experiment, state: "running", exclusions: [build(:experiment)])
      |> Repo.preload(:exclusions)
    Manager.start_experiment(exp)
    [exp: exp]
  end

  test "get an exclusions list of a specific experiment", context do
    exclusions = context.exp.exclusions
    assert length(exclusions) == 1
    exc_list = Experiment.get_exclusions_list(context.exp.id)
    assert length(exc_list) == 1
    assert exc_list == exclusions
  end
end
