defmodule Xperiments.Repo.Migrations.CreateXperiments.PayloadSchema do
  use Ecto.Migration

  def change do
    create table(:payload_schemas) do
      add :key, :string
      add :schema, :text
      add :application_id, references(:applications, on_delete: :nothing)

      timestamps()
    end

    create unique_index(:payload_schemas, [:key])
    create index(:payload_schemas, [:application_id])
  end
end
