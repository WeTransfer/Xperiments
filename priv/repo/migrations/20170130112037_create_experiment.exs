defmodule Xperiments.Repo.Migrations.CreateExperiment do
  use Ecto.Migration

  def change do
    create table(:experiments, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :name, :string
      add :description, :text
      add :start_date, :utc_datetime
      add :end_date, :utc_datetime
      add :sampling_rate, :decimal
      add :max_users, :integer

      add :application_id, references(:applications)
      add :user_id, references(:users)

      timestamps()
    end

  end
end
