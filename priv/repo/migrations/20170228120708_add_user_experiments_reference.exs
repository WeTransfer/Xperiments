defmodule Xperiments.Repo.Migrations.AddUserExperimentsReference do
  use Ecto.Migration

  def change do
    alter table(:experiments) do
      add :user_id, references(:users)
    end
  end
end
