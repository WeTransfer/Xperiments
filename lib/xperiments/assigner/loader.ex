defmodule Xperiments.Assigner.Loader do
  alias Xperiments.Experiment, as: ExperimentModel

  def load_experiments_from_db do
    ExperimentModel
    |> ExperimentModel.ready_to_run
    |> ExperimentModel.with_exclusions
    |> Xperiments.Repo.all
    |> Enum.each(&Xperiments.Assigner.ExperimentSupervisor.start_experiment/1)
  end
end
