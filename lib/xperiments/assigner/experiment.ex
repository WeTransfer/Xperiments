defmodule Xperiments.Assigner.Experiment do
  @moduledoc """
  Run an experiment using provided data.
  Each experiment stores the name in Registry, e.g. `{:via, Registry, {:registry_experiments, exp_id}}`
  """
  use GenServer
  require Logger
  alias Xperiments.Experiment, as: ModelExperiment

  @stat_treshold Application.get_env(:xperiments, Experiment)[:stat_threshold] # defines how often save statistic data to a DB

  def start_link(%{id: id} = experiment) do
    GenServer.start_link(__MODULE__, experiment, name: via_tuple(id))
  end

  def init(experiment) do
    case validate_experiment(experiment) do
      :ok ->
        :rand.seed(:exsplus)
        schedule_ending(experiment.end_date)
        {:ok, prepare_state(experiment)}
      {:error, reason} ->
        {:stop, reason}
    end
  end

  def terminate(reason, state) do
    do_sync_stat_to_db(state.statistics, state.id, true)
    Task.start(ModelExperiment, :set_terminated_state, [state.id])
    Logger.info "Shutting down the experiment '#{state.name}' with id #{state.id} with reason: #{reason}"
    :normal
  end

  defp schedule_ending(end_date) do
    duration = DateTime.to_unix(end_date, :milliseconds) - DateTime.to_unix(DateTime.utc_now(), :milliseconds)
    Process.send_after(self(), :end_experiment, duration)
  end

  defp via_tuple(id) do
    {:via, Registry, {:registry_experiments, id}}
  end

  defp prepare_state(experiment) do
    Map.take(experiment, [:id, :name, :rules, :start_date, :end_date, :inserted_at, :state, :exclusions, :statistics, :max_users])
    |> Map.merge(%{variants: do_build_segmented_variants(experiment.variants)})
    |> prepare_statistics
  end

  defp prepare_statistics(%{statistics: nil} = exp) do
    Map.update!(exp, :statistics, fn _ -> Map.from_struct(%ModelExperiment.Statistics{}) end)
  end
  defp prepare_statistics(exp), do: exp


  defp validate_experiment(experiment) do
    with :gt <- DateTime.compare(experiment.end_date, DateTime.utc_now()),
         true <- experiment.state in ["running", "stopped"] do
      :ok
    else
      err -> {:error, {:bad_experiment, err, experiment}}
    end
  end

  ## Client API

  @doc """
  Sets `stop` state for an experiment.
  So it stops assigns any new requests, but still will receive events.
  In fact, it pauses the experiment.
  """
  def stop(id) do
    GenServer.cast(via_tuple(id), {:stop})
  end

  def restart(id) do
    GenServer.cast(via_tuple(id), {:restart})
  end

  def register_priority(pid) do
    GenServer.call(pid, {:register_priority})
  end

  @doc """
  Adds an exclusions if an experiment is running
  """
  def add_exclusion(id, caller_id) do
    GenServer.cast(via_tuple(id), {:add_exclusion, caller_id})
  end

  @doc """
  Removes an exclusion if it exists
  """
  def remove_exclusion(pid, caller_id) when is_pid(pid) do
    GenServer.cast(pid, {:remove_exclusion, caller_id})
  end
  def remove_exclusion(id, caller_id) do
    GenServer.cast(via_tuple(id), {:remove_exclusion, caller_id})
  end

  @doc """
  Increment an impression for an experiment
  """
  def inc_impression(id, var_id) do
    GenServer.cast(via_tuple(id), {:inc_impression, var_id})
  end

  @doc """
  Gets a specific variant of the experiment
  """
  def get_experiment_data(pid, var_id) do
    GenServer.call(pid, {:get_experiment_data, var_id})
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

  @doc """
  Returns an exclusions list only if state is `running`
  Otherwise returns an empty list
  """
  def get_exclusions_list(pid) when is_pid(pid) do
    GenServer.call(pid, {:get_exclusions_list})
  end
  def get_exclusions_list(id) do
    GenServer.call(via_tuple(id), {:get_exclusions_list})
  end

  @doc """
  Check if segments satisfy to experiment rules.
  Experiment may don't have rules. In this case it accepts any segements.
  If there are no segements given and experiment have any rules, return `false`.
  Otherwise check that segments are satisfying rules
  """
  def accept_segments?(pid, segments \\ %{})
  def accept_segments?(pid, segments) when is_pid(pid) do
    GenServer.call(pid, {:check_segemets, segments})
  end
  def accept_segments?(id, segments) do
    GenServer.call(via_tuple(id), {:check_segemets, segments})
  end

  @doc """
  Check that an experiment is started.
  """
  def is_started?(pid) when is_pid(pid) do
    GenServer.call(pid, :is_started)
  end
  def is_started?(id) do
    GenServer.call(via_tuple(id), :is_started)
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

  def handle_cast({:add_exclusion, exc_id}, state) do
    new_state = Map.update!(state, :exclusions, fn ex_list -> [exc_id | ex_list] |> Enum.uniq() end)
    {:noreply, new_state}
  end

  def handle_cast({:remove_exclusion, exc_id}, state) do
    new_state = Map.update!(state, :exclusions, fn ex_list -> List.delete(ex_list, exc_id) end)
    {:noreply, new_state}
  end

  def handle_cast({:inc_impression, var_id}, state) do
    statistics =
      state.statistics
      |> Map.update!(:common_impression, & &1 + 1)
      |> Map.update!(:variants_impression, fn m ->
        Map.update(m, var_id, 1, fn v_imp -> v_imp + 1 end)
      end)
      |> do_sync_stat_to_db(state.id)
      |> do_terminate_if_reach_users_limit(state)
    {:noreply, Map.merge(state, %{statistics: statistics})}
  end

  def handle_call({:register_priority}, _caller, state) do
    {:ok, _} = Registry.register(:registry_priorities, self(), state.inserted_at)
    {:reply, :ok, state}
  end

  def handle_call({:get_exclusions_list}, _caller, %{state: "running", exclusions: exclusions} = state) do
    {:reply, exclusions, state}
  end
  def handle_call({:get_exclusions_list}, _caller, state) do
    {:reply, [], state}
  end

  def handle_call({:check_segemets, segments}, _caller, state) do
    {:reply, do_compare_rules(segments, state.rules), state}
  end

  def handle_call(:is_started, _caller, state) do
    response = :gt == DateTime.compare(DateTime.utc_now(), state.start_date)
    {:reply, response, state}
  end

  def handle_call({:get_experiment_data, var_id}, _caller, state) do
    response =
      case Enum.find(state.variants, &(&1.id == var_id)) do
        nil -> {:error, %{id: state.id}}
        variant ->
          {:ok,
           %{id: state.id,
             state: state.state, # heh, looks stupid
             start_date: state.start_date,
             end_date: state.end_date,
             variant: variant}}
      end
    {:reply, response, state}
  end

  def handle_call({:get_random_variant}, _caller, state) do
    response =
      Map.merge(
        Map.take(state, [:id, :name, :start_date, :end_date, :state]),
        %{variant: do_get_random_variant(state.variants) |> Map.drop([:segment_range])}
      )
    {:reply, response, state}
  end

  def hand_info(:end_experiment, state) do
    {:stop, :normal, state}
  end

  defp do_compare_rules(_, []), do: true
  defp do_compare_rules(segments, _) when segments == %{}, do: false
  defp do_compare_rules(segments, _) when is_nil(segments), do: false
  defp do_compare_rules(segments, rules) when map_size(segments) < length(rules), do: false
  defp do_compare_rules(segments, rules) do
    result =
      Enum.map(rules, fn r ->
        if given_value = Map.get(segments, String.downcase(r.parameter)) do
          apply(Kernel, String.to_atom(r.operator), [given_value, r.value])
        else
          false
        end
      end)
      |> Enum.dedup
    [true] == result
  end

  # Create segment ranges for each variant based on their allocations
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

  defp do_sync_stat_to_db(stat, eid, force \\ false)
  defp do_sync_stat_to_db(%{common_impression: imp} = stat, eid, force) when imp != 0 do
    if force or rem(stat.common_impression, @stat_treshold) == 0 do
      Task.start(ModelExperiment, :update_statistics, [eid, stat])
    end
    stat
  end
  defp do_sync_stat_to_db(stat, _, _), do: stat

  defp do_terminate_if_reach_users_limit(%{common_impression: imp} = stat, %{max_users: limit})
  when not is_nil(limit) and limit > 0 and imp >= limit do
    send self(), :end_experiment
    stat
  end
  defp do_terminate_if_reach_users_limit(stat, _), do: stat

end
