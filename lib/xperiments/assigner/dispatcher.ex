defmodule Xperiments.Assigner.Dispatcher do
  use GenServer
  alias Xperiment.Epxeriments.Experiment

  def start_link do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    {:ok, %{}}
  end

  ## Client API

  def return_suitable_experiments(client_id, rules, assigned_experiments \\ %{}) do
    GenServer.call(__MODULE__, {:return_suitable_experiments, rules, assigned_experiments})
  end

  ## Server

  def handle_call({:assign_to_experiments, rules, assigned_experiments}, _caller, state) do
    # exclusions_list = Map.keys(assigned_experiments) |> get_exclusions_list()
    # candidates = find_experiments(exclusions_list)
  end

  defp find_experiments(exclusions_list \\ []) do
    []
  end

  defp get_exclusions_list(experiments) do
    # experiments
    # |> Enum.map fn(id) ->
    #   Registry.lookup(:registry_experiments, id)
    #   |> Experiment.get_exclusion_list
    # end
    # |> List.flatten
  end
end
