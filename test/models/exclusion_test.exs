defmodule Xperiments.Experiments.ExclusionTest do
  use Xperiments.ModelCase

  import Xperiments.Factory
  alias Xperiments.Experiments.Exclusion

  test "udpate exclusions" do
    app = insert(:application)
    exclusions = insert_list(4, :experiment, application: app)
    exp = insert(:experiment, application: app, exclusions: exclusions)
    exp2 = insert(:experiment, application: app, exclusions: [exp])
    new_exp = insert(:experiment, application: app)

    excl_list = Exclusion.for_experiment(exp.id)
    assert length(excl_list) == 5
    assert length(Exclusion.for_experiment(exp2.id)) == 1

    new_exclusions_list = Enum.take(excl_list, 2) ++ [new_exp.id]
    Exclusion.update_exclusions(exp.id, new_exclusions_list)
    assert length(Exclusion.for_experiment(new_exp.id)) == 1
    assert Exclusion.for_experiment(exp.id) == Enum.take(excl_list, 2) ++ [new_exp.id]
  end
end
