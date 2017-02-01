defmodule Xperiments.ExperimentTest do
  use Xperiments.ModelCase

  alias Xperiments.{Experiment, User, Application}

  @valid_attrs %{description: "some content", end_date: %{day: 17, hour: 14, min: 0, month: 4, sec: 0, year: 2010}, max_users: 42, name: "some content", start_date: %{day: 17, hour: 14, min: 0, month: 4, sec: 0, year: 2010}}
  @invalid_attrs %{}
  @experiment %Experiment{user: %User{}, application: %Application{}}

  test "changeset with valid attributes" do
    changeset = Experiment.changeset(@experiment, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Experiment.changeset(@experiment, @invalid_attrs)
    refute changeset.valid?
  end

  test "changeset without an association" do
    changeset = Experiment.changeset(Map.delete(@experiment, :user), @valid_attrs)
    refute changeset.valid?
  end

  test "validation when at least one required field is not set" do
    changeset = Experiment.changeset(@experiment, Map.drop(@valid_attrs, [:sampling_rate, :max_users]))
    refute changeset.valid?
    assert changeset.errors == [__shared__: {"required at least one field", []}]
  end

  test "number validation when a field can be set or not" do
    changeset = Experiment.changeset(@experiment, %{@valid_attrs | max_users: 0})
    refute changeset.valid?
    assert changeset.errors == [max_users: {"must be greater than %{number}", [validation: :number, number: 0]}]
  end

  test "validate embedded fields: variants and rules" do
    variants = [
      %{name: "var a", allocation: 1, description: "nothing", payload: "test"}
    ]
    rules = [
      %{parameter: "lang", type: "string", operator: "==", value: "ru"}
    ]
    changeset = Experiment.changeset_with_embeds(@experiment,
      Map.merge(@valid_attrs, %{variants: variants, rules: rules}))
    assert changeset.valid?

    changeset = Experiment.changeset_with_embeds(@experiment, @valid_attrs)
    refute changeset.valid?
  end
end
