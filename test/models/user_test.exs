defmodule Xperiments.UserTest do
  use Xperiments.ModelCase

  alias Xperiments.User

  @valid_attrs %{email: "some@content", name: "some content", role: "some content", password: "123456"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = User.changeset(%User{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = User.changeset(%User{}, @invalid_attrs)
    refute changeset.valid?
  end

  test "creation of user with encrypted password" do
    changeset = User.changeset(%User{}, @valid_attrs)
    {:ok, user} = User.create_with_password(changeset)
    refute user.encrypted_password == changeset.params["password"]
  end

  test "comparing password for a given user" do
    changeset = User.changeset(%User{}, @valid_attrs)
    {:ok, user} = User.create_with_password(changeset)
    {:ok, new_user} = User.find_and_confirm_password(%{"email" => "some@content", "password" => "123456"})
    assert new_user.id == user.id
  end

  test "returning error if user not found" do
    {:error, msg} = User.find_and_confirm_password(%{"email" => "s@content", "password" => "123456"})
    assert msg == "invalid user-identifier"
  end

  test "returning error if a wrong password given" do
    changeset = User.changeset(%User{}, @valid_attrs)
    {:ok, _user} = User.create_with_password(changeset)
    {:error, msg} = User.find_and_confirm_password(%{"email" => "some@content", "password" => "wrong"})
    assert msg == "invalid password"
  end
end
