defmodule Xperiments.Repo.Migrations.AddStateToExperiments do
  use Ecto.Migration

  def change do
    alter table(:experiments) do
      add :state, :string, default: "draft"
    end
  end
end
