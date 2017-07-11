defmodule Xperiments.BroadcastService do
  @channel "experiments:all"
  @endpoint Xperiments.Web.Endpoint

  @doc """
  Broadcasts messages when specific states are changed

  ## Parameters:

    - previous_state: String, previous state of an experiment
    - current_state: String, current state if an experiment
    - payload: Map, data which should be send
  """
  def broadcast_state_changes("draft", "running", exp) do
    @endpoint.broadcast(@channel, "start_experiment", %{experiment_data: exp})
  end
  def broadcast_state_changes("stopped", "running", %{id: id}) do
    @endpoint.broadcast(@channel, "run_experiment", %{id: id})
  end
  def broadcast_state_changes("running", "stopped", %{id: id}) do
    @endpoint.broadcast(@channel, "stop_experiment", %{id: id})
  end
  def broadcast_state_changes("stopped", "terminated", %{id: id}) do
    @endpoint.broadcast(@channel, "terminate_experiment", %{id: id})
  end
  def broadcast_state_changes(_, _), do: :ok # handle any other state changes

  @doc "Sends impression events to experiments"
  def broadcast_impression(eid, var_id) do
    @endpoint.broadcast(@channel, "event:impression", %{eid: eid, var_id: var_id})
  end
end
