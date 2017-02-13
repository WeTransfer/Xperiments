defmodule Xperiments.VariantTest do
  use Xperiments.ModelCase
  alias Xperiments.Variant

  @valid_attrs %{name: "Variant A", allocation: 30, description: "Test the red button",
  payload: "{'color': 'red'}", control_group: false}

  test "changeset with valid attributes" do
    changeset = Variant.changeset(%Variant{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Variant.changeset(%Variant{}, %{name: "Varaint"})
    refute changeset.valid?
  end

  test "validate a number for an allocation field" do
    changeset = Variant.changeset(%Variant{}, %{@valid_attrs | allocation: 101})
    refute changeset.valid?
  end

  test "don't validate required payload for a control group variant" do
    attrs_without_payload = Map.drop(@valid_attrs, [:payload])
    changeset = Variant.changeset(%Variant{}, attrs_without_payload)
    refute changeset.valid?
    changeset = Variant.changeset(%Variant{}, %{ attrs_without_payload | control_group: true })
    assert changeset.valid?
  end
end
