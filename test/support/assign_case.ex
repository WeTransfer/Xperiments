defmodule Xperiments.AssignCase do
  @moduledoc """
  This module defines the test case to be used by
  an assign application tests.

  """

  use ExUnit.CaseTemplate

  using do
    quote do
      alias Xperiments.Repo

      import Xperiments.Factory
    end
  end

  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Xperiments.Repo)

    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(Xperiments.Repo, {:shared, self()})
    end

    :ok
  end
end
