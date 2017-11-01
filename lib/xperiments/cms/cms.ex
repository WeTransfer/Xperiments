defmodule Xperiments.Cms do
  @moduledoc """
  CMS functionalit.
  It allows to manage applications, users and other.
  """
  @behaviour Bodyguard.Policy

  alias Xperiments.Repo
  alias Xperiments.Cms.{User, Application}

  ## User

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

  ## Application

  def get_applications_list do
    Repo.all(Application)
  end

  def get_application(name) do
    case Repo.get_by(Application, name: name) do
      nil -> {:error, :application_not_found, name}
      app -> {:ok, app}
    end
  end


  def create_application(params) do
    changeset = Application.changeset(%Application{}, params)
    Repo.insert(changeset)
  end

  def update_application(name, update_params) do
    application = Repo.get_by!(Application, name: name)
    changeset = Application.changeset(application, update_params)
    Repo.update(changeset)
  end

  def delete_application(name) do
    application = Repo.get_by!(Application, name: name)
    Repo.delete(application)
  end

  # Bodyguard callback
  @doc """
  Policies for aothurizations:
    - Admins can do everything
    - Simple users can see list of applications
  """
  def authorize(_, %User{role: "admin"}, _), do: true
  def authorize(:get_applications_list, _, _params), do: true
  def authorize(_, _, _), do: false
end
