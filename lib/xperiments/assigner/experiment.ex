defmodule Xperiments.Assigner.Experiment do
  @moduledoc """
  Run an experiment using provided data.
  Each experiment stores the name in Registry, e.g. `{:via, Registry, {:registry_experiments, exp_id}}`
  """
  use GenServer

  def start_link(%{id: id} = experiment) do
    GenServer.start_link(__MODULE__, experiment, name: via_tuple(id))
  end

  def init(experiment) do
    state = Map.take(experiment, [:id, :name, :rules, :variants, :start_date, :end_date,
                                  :created_at, :exclusions])
    {:ok, state}
  end

  def via_tuple(id) do
    {:via, Registry, {:registry_experiments, id}}
  end

  ## Client API

  @doc """
  Set `stop` state for an experiment.
  So it stops assigns any new requests, but still will receive events.
  In fact, it pauses the experiment.
  """
  def stop(id) do
    GenServer.cast(via_tuple(id), {:stop})
  end

  def restart(id) do
    GenServer.cast(via_tuple(id), {:restart})
  end

  @doc """
  Get a specific variant of the experiment
  """
  def get_variant(pid, var_name) do

  end

  def get_exclusion_list(pid) do
    GenServer.call(pid, {:get_exclusion_list})
  end


  def assign_client_to_variant(client_id) do

  end

  def accept_rules?(pid, rules) do
    GenServer.call(pid, {:check_rules, rules})
  end

  ## Server

  def handle_cast({:stop}, state) do
    new_state = %{state | state: "stopped"}
    {:noreply, new_state}
  end

  def handle_cast({:restart}, state) do
    new_state = %{state | state: "running"}
    {:noreply, new_state}
  end

  @doc """
  Returns an exclussions list only if state is `running`
  Otherwise returns an empty list
  """
  def handle_call({:get_exclusion_list}, _caller, state = %{state: "running", exclussions: exclussions}) do
    {:reply, exclussions, state}
  end
  def handle_call({:get_exclusion_list}, _caller, state) do
    {:reply, [], state}
  end

  def handle_call({:check_rules, rules}, _caller, state) do
    # compare_rules(rules, state[:rules])
    {:reply, true, state}
  end

end
