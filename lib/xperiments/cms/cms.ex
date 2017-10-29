defmodule Xperiments.Cms do
  @moduledoc """
  CMS functionalit.
  It allows to manage applications, users and other.
  """
  alias Xperiments.Repo
  alias Xperiments.Cms.User

  def get_users_list do
    Repo.all(User)
  end

  def create_user(user_params) do
    chset = User.changeset(%User{}, user_params)
    Repo.insert(chset)
  end

  def update_user(id, update_params) do
    user = Repo.get!(User, id)
    changeset = User.changeset(user, update_params)
    Repo.update(changeset)
  end

  def delete_user(id) do
    user = Repo.get!(User, id)
    Repo.delete(user)
  end
end
