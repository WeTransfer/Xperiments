defmodule Xperiments.Repo.Migrations.CreateExperimentsExclusionsTable do
  use Ecto.Migration

  def change do
    create table(:experiments_exclusions, primary_key: false) do
      add :experiment_a_id, :binary_id
      add :experiment_b_id, :binary_id
    end
  end
end
