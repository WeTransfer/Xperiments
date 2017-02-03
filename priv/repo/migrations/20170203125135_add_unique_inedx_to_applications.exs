defmodule Xperiments.Repo.Migrations.AddUniqueInedxToApplications do
  use Ecto.Migration

  def change do
    create unique_index(:applications, [:name])
  end
end
