defmodule Xperiments.Repo.Migrations.AddDefaultsAndNameToPayloadShema do
  use Ecto.Migration

  def change do
    alter table(:payload_schemas) do
      add :defaults, :text
      add :name, :string
    end
  end
end
