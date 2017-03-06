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

  test "validate operators for specific types" do
    chset = Rule.changeset(%Rule{}, %{@valid_attrs | operator: ">="})
    refute chset.valid?
    assert hd(chset.errors) == {:type, {"For String types only '==' and '!=' operators are allowed", []}}
    # boolean
    chset = Rule.changeset(%Rule{}, %{@valid_attrs | type: "boolean", operator: "!="})
    refute chset.valid?
    assert hd(chset.errors) == {:type, {"Boolean type must have only '==' operator and value should be 'true' or 'false'", []}}
  end

  test "downcase of a parameter when saving" do
    chset = Rule.changeset(%Rule{}, %{@valid_attrs | parameter: "Lang"})
    assert chset.valid?
    assert chset.changes[:parameter] == "lang"
  end
end
