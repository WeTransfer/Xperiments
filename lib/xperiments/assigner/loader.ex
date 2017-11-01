defmodule Xperiments.Assigner.Loader do
  alias Xperiments.Experiments.Experiment, as: ExperimentModel

  def load_experiments_from_db do
    ExperimentModel
    |> ExperimentModel.ready_to_run
    |> Xperiments.Repo.all
    |> Enum.map(fn ex -> Map.merge(ex, %{exclusions: Xperiments.Experiments.Exclusion.for_experiment(ex.id)}) end)
    |> Enum.each(&Xperiments.Assigner.ExperimentSupervisor.start_experiment/1)
  end
end
