defmodule Xperiments.Assigner.Experiment do
  @moduledoc """
  Run an experiment using provided data.
  Each experiment stores the name in Registry, e.g. `{:via, Registry, {:registry_experiments, exp_id}}`
  """
  use GenServer

  def start_link(%{id: id} = experiment) do
    GenServer.start_link(__MODULE__, experiment, name: via_tuple(id))
  end

  def init(%{state: state} = experiment) when state in ["running", "stopped"] do
    :random.seed(:erlang.now)
    temp_state = Map.take(experiment, [:id, :name, :rules, :start_date, :end_date,
                                       :created_at, :state, :exclusions])
    state = Map.merge(temp_state, %{variants: do_build_segmented_variants(experiment.variants)})
    {:ok, state}
  end
  def init(experiment),
    do: {:stop, {:bad_experiment, experiment}}

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
  def get_variant(id, var_name) do

  end

  @doc """
  Assign a variant based on their allocations
  """
  def get_random_variant(pid) when is_pid(pid) do
    GenServer.call(pid, {:get_random_variant})
  end
  def get_random_variant(id) do
    GenServer.call(via_tuple(id), {:get_random_variant})
  end

  def get_exclusions_list(id) do
    GenServer.call(via_tuple(id), {:get_exclusion_list})
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
  Returns an exclusions list only if state is `running`
  Otherwise returns an empty list
  """
  def handle_call({:get_exclusion_list}, _caller, %{state: "running", exclusions: exclusions} = state) do
    {:reply, exclusions, state}
  end
  def handle_call({:get_exclusion_list}, _caller, state) do
    {:reply, [], state}
  end

  # TODO: WIP
  def handle_call({:check_rules, rules}, _caller, state) do
    {:reply, true, state}
  end

  def handle_call({:get_random_variant}, _caller, state) do
    response = Map.merge(
      Map.take(state, [:id, :name, :start_date, :end_date]),
      %{variant: do_get_random_variant(state.variants)}
    )
    {:reply, response, state}
  end

  # Create segment ranges for each variant based on their allocations
  @doc false
  defp do_build_segmented_variants(variants) do
    {segmented_variants, _} =
      variants
      |> Enum.sort(& &1.allocation >= &2.allocation)
      |> Enum.map_reduce(0, fn var, cursor ->
        new_cursor = cursor + var.allocation
        {
          Map.merge(var, %{segment_range: Range.new(cursor + 1, new_cursor)}),
          new_cursor
        }
      end)
    segmented_variants
  end

  defp do_get_random_variant(variants) do
    rand_num = :rand.uniform(100)
    Enum.filter(variants, fn var -> rand_num in var.segment_range end)
    |> List.first
    |> Map.drop([:segment_range])
  end

end
