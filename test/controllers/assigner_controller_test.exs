defmodule Xperiments.AssignerControllerTest do
  use Xperiments.ConnCase, async: false
  alias Xperiments.Assigner.ExperimentSupervisor

  setup do
    for e_pid <- ExperimentSupervisor.experiment_pids() do
      Supervisor.terminate_child(ExperimentSupervisor, e_pid)
    end
    app = insert(:application, name: "test_app")
    for _i <- 0..2 do
      build(:experiment, state: "running", application: app)
      |> Xperiments.Factory.with_balanced_variants
      |> insert
      |> Xperiments.Repo.preload(:exclusions)
      |> Xperiments.Assigner.ExperimentSupervisor.start_experiment
    end
    conn =
      build_conn()
      |> put_req_header("accept", "application/json")
    [conn: conn]
  end

  @api_path "/assigner/application/test_app"

  test "/experiments returns assigner variants", context do
    body =
      post(context.conn, @api_path <> "/experiments", %{})
      |> json_response(200)
    assert length(body["assign"]) == 3
    ids =
      Xperiments.Repo.all(Xperiments.Experiment)
      |> Enum.map(& &1.id)
    returned_ids = body["assign"] |> Enum.map(fn e -> e["id"] end)
    assert Enum.sort(returned_ids) == Enum.sort(ids)
  end

  test "returning of a specific variant as to check how it looks like", context do
    exp = insert(:experiment)
    var = List.first(exp.variants)
    body =
      get(context.conn, "#{@api_path}/experiments/#{exp.id}/variants/#{var.id}")
      |> json_response(200)
    assert List.first(body["assign"])["id"] == exp.id
  end
end
