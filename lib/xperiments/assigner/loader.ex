defmodule Xperiments.Assigner.Loader do
  use GenServer

  def start_link do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(_) do
    # Load records from DB
    # pass them
    {:ok, %{}}
  end

  def handle_cast({:loaded, experiments}, state) do
    # Enum.each(experiments, fn (exp) ->

    #   end)
  end


end
