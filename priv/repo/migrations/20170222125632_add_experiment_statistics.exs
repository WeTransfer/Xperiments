defmodule Xperiments.Repo.Migrations.AddExperimentStatistics do
  use Ecto.Migration

  def change do
    alter table(:experiments) do
      add :statistics, :map
    end
  end
end
