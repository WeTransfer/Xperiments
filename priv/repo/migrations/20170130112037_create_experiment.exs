defmodule Xperiments.Repo.Migrations.CreateExperiment do
  use Ecto.Migration

  def change do
    create table(:expirements, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :name, :string
      add :description, :text
      add :start_date, :utc_datetime
      add :end_date, :utc_datetime
      add :sampling_rate, :decimal
      add :max_users, :integer

      timestamps()
    end

  end
end
