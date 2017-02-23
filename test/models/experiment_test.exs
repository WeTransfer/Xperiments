defmodule Xperiments.ExperimentTest do
  use Xperiments.ModelCase
  use Timex

  import Xperiments.Factory
  alias Xperiments.{Experiment, Application}

  def build_date(shift_days) do
    Timex.now()
    |> Timex.shift(days: shift_days)
    |> Timex.format!("{ISO:Extended:Z}")
  end

  setup_all do
    [
      valid_attrs: %{description: "some content",
                     end_date: build_date(3),
                     sampling_rate: 100,
                     max_users: 42,
                     name: "some content",
                     start_date: build_date(1)},
      experiment:  %Experiment{application: %Application{}}
    ]
  end

  test "changeset with valid attributes", context do
    changeset = Experiment.changeset(context[:experiment], context[:valid_attrs])
    assert changeset.valid?
  end

  test "changeset with invalid attributes", context do
    changeset = Experiment.changeset(context[:experiment], %{})
    refute changeset.valid?
  end

  test "number validation when a field can be set or not", context do
    changeset = Experiment.changeset(context[:experiment], %{context[:valid_attrs] | max_users: 0})
    assert changeset.errors == [max_users: {"must be greater than %{number}", [validation: :number, number: 0]}]
    refute changeset.valid?
  end

  test "validate embedded fields: variants and rules", context do
    variants = [
      %{name: "var a", allocation: 100, description: "nothing", payload: "test"}
    ]
    rules = [
      %{parameter: "lang", type: "string", operator: "==", value: "ru"}
    ]
    changeset = Experiment.changeset_update(context[:experiment],
      Map.merge(context[:valid_attrs], %{variants: variants, rules: rules}))
    assert changeset.valid?

    changeset = Experiment.changeset_update(context[:experiment], context[:valid_attrs])
    refute changeset.valid?
  end

  test "changeset with a start date greater than an end date", context do
    attrs = %{context[:valid_attrs] | end_date: build_date(-1)}
    changeset = Experiment.changeset(context[:experiment], attrs)
    refute changeset.valid?
  end

  test "changeset with a date in the past", context do
    attrs = %{context[:valid_attrs] | start_date: build_date(-1)}
    changeset = Experiment.changeset(context[:experiment], attrs)
    refute changeset.valid?
  end

  test "states changes" do
    experiment = insert(:experiment, variants: [%{ Xperiments.Factory.variant() | control_group: true }], start_date: Timex.now |> Timex.shift(days: 1))
    assert experiment.state == "draft"
    assert Experiment.can_run?(experiment) == true
    assert Experiment.can_terminate?(experiment) == false

    updated_exp = Experiment.run(experiment)
    |> Xperiments.Repo.update!
    assert updated_exp.state == "running"

    invalid_changeset = Experiment.run(updated_exp)
    refute invalid_changeset.valid?
  end

  test "can't run experiment without variants" do
    experiment = insert(:experiment, variants: [])
    assert experiment.state == "draft"

    falsy_changeset = Experiment.run(experiment)
    refute falsy_changeset.valid?
  end

  test "that we can strore big chunks of data in one row with an experiment" do
    variant = Xperiments.Factory.variant()
    exp = insert(:experiment, variants: [variant])
    db_var_payload = (exp.variants |> List.first).payload
    assert db_var_payload == variant.payload
  end

  test "validation that at least one varian is a control group when running" do
    bad_exp = build(:experiment, start_date: Timex.now |> Timex.shift(days: 1)) |> with_balanced_variants |> insert
    changeset = Experiment.change_state(bad_exp, "run")
    refute changeset.valid?
    variants = [
      Xperiments.Factory.variant(50),
      %{ Xperiments.Factory.variant(50) | control_group: true }
    ]
    exp = insert(:experiment, variants: variants, start_date: Timex.now |> Timex.shift(days: 1))
    changeset = Experiment.run(exp)
    assert changeset.valid?
  end

  test "rules should be without a primary key" do
    exp = insert(:experiment, rules: Xperiments.Factory.rules_1)
    Enum.map(exp.rules, fn r ->
      assert nil == Map.get(r, :id)
    end)
  end

  test "rules replaces on update" do
    exp = insert(:experiment, start_date: Timex.now |> Timex.shift(days: 1), rules: Xperiments.Factory.rules_1)
    assert Xperiments.Factory.rules_1 == Enum.map(exp.rules, &Map.from_struct/1)
    changeset = Experiment.changeset_update(exp, %{rules: Xperiments.Factory.rules_2})
    assert changeset.valid?
    updated_exp = Repo.update!(changeset)
    assert Xperiments.Factory.rules_2 == Enum.map(updated_exp.rules, &Map.from_struct/1)
  end

  test "able to update an experiment with draft state only" do
    exp = build(:experiment, start_date: Timex.now |> Timex.shift(days: 1))
    changeset = Experiment.changeset_update(exp, %{name: "New super name"})
    assert changeset.valid?
    exp_2 = build(:experiment, start_date: Timex.now |> Timex.shift(days: 1), state: "running")
    changeset = Experiment.changeset_update(exp_2, %{name: "New super name"})
    refute changeset.valid?
  end

  test "update statistics" do
    exp = insert(:experiment, start_date: Timex.now |> Timex.shift(days: 1))
    assert is_nil(exp.statistics)
    stat = %{common_impression: 10, variants_impression: %{}}
    exp = Experiment.update_statistics(exp.id, stat)
    assert Map.from_struct(exp.statistics) == stat
  end

  test "updating a state to terminated" do
    exp = insert(:experiment, state: "running", start_date: Timex.now |> Timex.shift(days: 1))
    exp = Experiment.set_terminated_state(exp.id)
    assert exp.state == "terminated"
  end
end
