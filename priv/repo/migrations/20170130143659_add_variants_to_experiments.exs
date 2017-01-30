defmodule Xperiments.Repo.Migrations.AddVariantsToExperiments do
  use Ecto.Migration

  def change do
    alter table(:expirements) do
      add :variants, {:array, :map}, default: []
    end
  end
end
