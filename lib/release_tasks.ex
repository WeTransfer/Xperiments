defmodule Xperiments.ReleaseTasks do

  @start_apps [
    :postgrex,
    :ecto
  ]

  @repos [
    Xperiments.Repo
  ]

  def migrate do
    do_preparations()

    # Run migrations
    Enum.each(@repos, &run_migrations_for/1)

    # Signal shutdown
    IO.puts "Success!"
    :init.stop()
  end

  defp run_migrations_for(repo) do
    IO.puts "Running migrations for #{repo}"
    Ecto.Migrator.run(repo, migrations_path(:xperiments), :up, all: true)
  end

  defp do_preparations do
    IO.puts "Loading xperiments.."
    # Load the code, but don't start it
    :ok = Application.load(:xperiments)

    IO.puts "Starting dependencies.."
    # Start apps necessary for executing migrations
    Enum.each(@start_apps, &Application.ensure_all_started/1)

    # Start the Repo(s)
    IO.puts "Starting repos.."
    Enum.each(@repos, &(&1.start_link(pool_size: 1)))
  end

  defp migrations_path(app), do: Application.app_dir(app, "priv/repo/migrations")
end
