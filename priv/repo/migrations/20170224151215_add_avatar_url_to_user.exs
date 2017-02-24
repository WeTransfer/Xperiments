defmodule Xperiments.Repo.Migrations.AddAvatarUrlToUser do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :avatar_uri, :string
    end
  end
end
