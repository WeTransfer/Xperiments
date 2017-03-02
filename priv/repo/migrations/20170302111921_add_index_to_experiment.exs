defmodule Xperiments.Repo.Migrations.AddIndexToExperiment do
  use Ecto.Migration

  def change do
    create index(:experiments, [:state])
  end
end
