defmodule Xperiments.Repo.Migrations.AddSettingsToApplication do
  use Ecto.Migration

  def change do
    alter table(:applications) do
      add :settings, :map
    end
  end
end
