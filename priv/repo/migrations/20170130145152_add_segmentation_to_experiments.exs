defmodule Xperiments.Repo.Migrations.AddSegmentationToExperiments do
  use Ecto.Migration

  def change do
    alter table(:expirements) do
      add :rules, {:array, :map}, default: []
    end
  end
end
