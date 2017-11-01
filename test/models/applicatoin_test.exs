defmodule Xperiments.Cms.ApplicationTest do
  use Xperiments.ModelCase
  import Xperiments.Factory

  alias Xperiments.Cms.Application

  @valid_attrs %{name: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Application.changeset(%Application{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Application.changeset(%Application{}, @invalid_attrs)
    refute changeset.valid?
  end

  test "validation of an unique constraint for `name` field" do
    insert(:application, name: "frontend")
    changeset = Application.changeset(%Application{}, %{name: "frontend"})
    assert {:error, changeset} = Repo.insert(changeset)
    assert changeset.errors[:name] == {"has already been taken", []}
  end

  test "forced lowercase for a name" do
    changeset = Application.changeset(%Application{}, %{name: "OSX"})
    assert changeset.changes.name == "osx"
  end
end
