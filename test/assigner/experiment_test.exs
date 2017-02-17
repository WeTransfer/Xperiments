defmodule Xperiments.Assigner.ExperimentTest do
  use Xperiments.AssignCase
  alias Xperiments.Assigner.{ExperimentSupervisor, Experiment}

  setup do
    app = insert(:application, name: "web")
    excluded_exp = insert(:experiment, application: app)
    exp =
      insert(:experiment, state: "running", exclusions: [excluded_exp], rules: Xperiments.Factory.rules_1)
      |> Repo.preload(:exclusions)
    ExperimentSupervisor.start_experiment(exp)
    [exp: exp, excluded_exp: excluded_exp]
  end

  test "get an exclusions list of a specific experiment", context do
    exclusions = context.exp.exclusions
    assert length(exclusions) == 1
    exc_list = Experiment.get_exclusions_list(context.exp.id)
    assert length(exc_list) == 1
    assert exc_list == Enum.map(exclusions, & &1.id)
  end

  test "experiment return a randomly (according to an allocation) assigned result" do
    exp = Xperiments.Factory.experiment_with_balanced_variants()
    ExperimentSupervisor.start_experiment(exp)
    variant = Experiment.get_random_variant(exp.id)
    assert is_map(variant)
  end

  test "correctly assignes of variants based for many requests based on variants allocations" do
    exp = Xperiments.Factory.experiment_with_balanced_variants()
    ExperimentSupervisor.start_experiment(exp)
    allocations = for _i <- 0..10000 do
      exp = Experiment.get_random_variant(exp.id)
      exp.variant.allocation
    end

    assert_in_delta Enum.count(allocations, &(&1 == 50)), 5000, 200
    assert_in_delta Enum.count(allocations, &(&1 == 30)), 3000, 200
    assert_in_delta Enum.count(allocations, &(&1 == 20)), 2000, 200
  end

  test "check rules correctly", context do
    eid = context.exp.id
    bad_segment_1 = %{"type" => "plus"}
    bad_segment_2 = %{"lang" => "de"}
    bad_segment_3 = %{"lang" => "ru", "system" => "windows"}
    bad_segment_4 = %{"system" => "osx"}
    refute Experiment.accept_segments?(eid, bad_segment_1)
    refute Experiment.accept_segments?(eid, bad_segment_2)
    refute Experiment.accept_segments?(eid, bad_segment_3)
    refute Experiment.accept_segments?(eid, bad_segment_4)

    good_segment = %{"lang" => "ru", "system" => "osx"}
    assert Experiment.accept_segments?(eid, good_segment)
  end
end
