defmodule Xperiments.Repo.Migrations.CreateApplication do
  use Ecto.Migration

  def change do
    create table(:applications) do
      add :name, :string

      timestamps()
    end

  end
end
