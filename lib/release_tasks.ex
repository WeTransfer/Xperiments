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

  def seed do
    do_preparations()

    # Run migrations
    Enum.each(@repos, &run_migrations_for/1)

    # Run the seed script if it exists
    seed_script = seed_path(:xperiments)
    if File.exists?(seed_script) do
      IO.puts "Running seed script.."
      Code.eval_file(seed_script)
    end

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
  defp seed_path(app), do: Path.join(Application.app_dir(app, "priv/repo/"), "seed.exs")
end
