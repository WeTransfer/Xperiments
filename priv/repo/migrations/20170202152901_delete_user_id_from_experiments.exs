defmodule Xperiments.Repo.Migrations.DeleteUserIdFromExperiments do
  use Ecto.Migration

  def change do
    alter table(:experiments) do
      remove :user_id
    end
  end
end
