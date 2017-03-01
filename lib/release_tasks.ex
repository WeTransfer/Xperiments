defmodule Release.Tasks do
  def migrate do
    {:ok, _} = Application.ensure_all_started(:xperiments)

    path = Application.app_dir(:xperiments, "priv/repo/migrations")

    Ecto.Migrator.run(Xperiments.Repo, path, :up, all: true)
  end
end
