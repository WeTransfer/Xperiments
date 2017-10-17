defmodule Xperiments.PayloadSchemaTest do
  use Xperiments.ModelCase
  import Xperiments.Factory

  alias Xperiments.PayloadSchema

  @valid_attrs %{key: "one", schema: "{'a': 1}", application_id: 1, name: "CP", defaults: "{}"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = PayloadSchema.changeset(%PayloadSchema{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = PayloadSchema.changeset(%PayloadSchema{}, @invalid_attrs)
    refute changeset.valid?
  end

  test "validation of an unique constraint for `key` field" do
    insert(:payload_schema, key: "one")
    changeset = PayloadSchema.changeset(%PayloadSchema{}, @valid_attrs)
    assert {:error, changeset} = Repo.insert(changeset)
    assert changeset.errors[:key] == {"has already been taken", []}
  end

  test "required reference to an application" do
    changeset = PayloadSchema.changeset(%PayloadSchema{}, %{key: "one"})
    refute changeset.valid?
  end
end
