defmodule Xperiments.RuleTest do
  use Xperiments.ModelCase
  alias Xperiments.Rule

  @valid_attrs %{parameter: "lang", type: "string", operator: "==", value: "eu"}

  test "changest with valid attributes" do
    changeset = Rule.changeset(%Rule{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changest with invalid attributes" do
    changeset = Rule.changeset(%Rule{}, %{})
    refute changeset.valid?
  end

  test "validation of types and opertators" do
    changeset = Rule.changeset(%Rule{}, %{@valid_attrs | operator: "!"})
    refute changeset.valid?
    changeset = Rule.changeset(%Rule{}, %{@valid_attrs | type: "bad_type"})
    refute changeset.valid?
  end
end
