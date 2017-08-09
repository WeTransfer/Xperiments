defmodule Xperiments.Mixfile do
  use Mix.Project

  def project do
    [app: :xperiments,
     version: "0.0.1",
     elixir: "~> 1.4",
     elixirc_paths: elixirc_paths(Mix.env),
     compilers: [:phoenix, :gettext] ++ Mix.compilers,
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     aliases: aliases(),
     deps: deps()]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [mod: {Xperiments, []},
    extra_applications: [:logger, :runtime_tools]]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_),     do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [{:phoenix, "~> 1.3.0-rc.2", override: true},
     {:phoenix_pubsub, "~> 1.0"},
     {:phoenix_ecto, "~> 3.0"},
     {:phoenix_html, "~> 2.6"},
     {:postgrex, ">= 0.0.0"},
     {:gettext, "~> 0.11"},
     {:cowboy, "~> 1.0"},
     {:ecto_state_machine, "~> 0.3.0"},
     {:timex, "~> 3.0"},
     {:cors_plug, "~> 1.2"},
     {:ueberauth, "~> 0.4"},
     {:ueberauth_google, "~> 0.5"},
     {:guardian, "~> 0.14"},
     {:bodyguard, "~> 0.6.1"},
     {:distillery, "~> 1.0"},
     {:appsignal, "~> 0.0"},
     {:remote_ip, "~> 0.1.0"},
     {:hammer, "~> 0.1.0"},
     {:ex_machina, "~> 1.0", only: :test},
     {:mock, "~> 0.2.0", only: :test}]
  end

  defp aliases do
    ["ecto.setup": ["ecto.create", "ecto.migrate"],
     "ecto.reset": ["ecto.drop", "ecto.setup"],
     "test": ["ecto.create --quiet", "ecto.migrate", "test"]]
  end
end
