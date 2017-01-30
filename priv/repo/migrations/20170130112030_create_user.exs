defmodule Xperiments.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string
      add :name, :string
      add :role, :string

      timestamps()
    end

  end
end
