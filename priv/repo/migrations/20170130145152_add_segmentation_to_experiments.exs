defmodule Xperiments.Repo.Migrations.AddSegmentationToExperiments do
  use Ecto.Migration

  def change do
    alter table(:experiments) do
      add :rules, {:array, :map}, default: []
    end
  end
end
