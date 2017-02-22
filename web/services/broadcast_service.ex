defmodule Xperiments.Services.BroadcastService do
  @channel "experiments:all"

  @doc """
  Broadcast messages when specific states are changed

  ## Parameters:
  - previous_state: String, previous state of an experiment
  - current_state: String, current state if an experiment
  - payload: Map, data which should be send
  """
  def broadcast_state_changes("draft", "running", exp) do
    Xperiments.Endpoint.broadcast(@channel, "start_experiment", %{experiment_data: exp})
  end
  def broadcast_state_changes("stopped", "running", %{id: id}) do
    Xperiments.Endpoint.broadcast(@channel, "run_experiment", %{id: id})
  end
  def broadcast_state_changes("running", "stopped", %{id: id}) do
    Xperiments.Endpoint.broadcast(@channel, "stop_experiment", %{id: id})
  end
  def broadcast_state_changes("stopped", "terminated", %{id: id}) do
    Xperiments.Endpoint.broadcast(@channel, "terminate_experiment", %{id: id})
  end
  def broadcast_state_changes(_, _), do: :ok # handle any other state changes
end