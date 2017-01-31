defmodule Xperiments.Repo.Migrations.AddStateToExperiments do
  use Ecto.Migration

  def change do
    alter table(:expirements) do
      add :state, :string, default: "draft"
    end
  end
end
