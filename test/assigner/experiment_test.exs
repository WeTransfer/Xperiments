defmodule Xperiments.Assigner.ExperimentTest do
  use Xperiments.AssignCase
  alias Xperiments.Assigner.{Manager, Experiment}

  setup do
    app = insert(:application, name: "web")
    excluded_exp = insert(:experiment, application: app)
    exp =
      insert(:experiment, state: "running", exclusions: [excluded_exp])
      |> Repo.preload(:exclusions)
    Manager.start_experiment(exp)
    [exp: exp, excluded_exp: excluded_exp]
  end

  test "get an exclusions list of a specific experiment", context do
    exclusions = context.exp.exclusions
    assert length(exclusions) == 1
    exc_list = Experiment.get_exclusions_list(context.exp.id)
    assert length(exc_list) == 1
    assert exc_list == exclusions
  end

  test "experiment return a randomly (according to an allocation) assigned result" do
    exp = Xperiments.Factory.experiment_with_balanced_variants()
    Manager.start_experiment(exp)
    variant = Experiment.get_random_variant(exp.id)
    assert is_map(variant)
  end

  test "correctly assignes of variants based for many requests based on variants allocations" do
    exp = Xperiments.Factory.experiment_with_balanced_variants()
    Manager.start_experiment(exp)
    allocations = for _i <- 0..10000 do
      exp = Experiment.get_random_variant(exp.id)
      exp.variant.allocation
    end

    assert_in_delta Enum.count(allocations, &(&1 == 50)), 5000, 200
    assert_in_delta Enum.count(allocations, &(&1 == 30)), 3000, 200
    assert_in_delta Enum.count(allocations, &(&1 == 20)), 2000, 200
  end
end
