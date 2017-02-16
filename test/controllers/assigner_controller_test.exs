defmodule Xperiments.AssignerControllerTest do
  use Xperiments.ConnCase, async: false
  alias Xperiments.Assigner.ExperimentSupervisor

  setup do
    for e_pid <- ExperimentSupervisor.experiment_pids() do
      Supervisor.terminate_child(ExperimentSupervisor, e_pid)
    end
    app = insert(:application, name: "test_app")
    build_and_run_experiments(3, state: "running", application: app)
    conn =
      build_conn()
      |> put_req_header("accept", "application/json")
    [conn: conn, app: app]
  end

  def build_and_run_experiments(quantity, opts) do
    for _i <- 1..quantity do
      build(:experiment, opts)
      |> Xperiments.Factory.with_balanced_variants
      |> insert
      |> Xperiments.Repo.preload(:exclusions)
      |> Xperiments.Assigner.ExperimentSupervisor.start_experiment
    end
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

  test "rules/segments logic", context do
    build_and_run_experiments(2, state: "running", application: context.app, rules: Xperiments.Factory.rules_1)
    build_and_run_experiments(1, state: "running", application: context.app, rules: Xperiments.Factory.rules_2)

    body =
      post(context.conn, @api_path <> "/experiments", segments: %{lang: "en"})
      |> json_response(200)
    assert length(body["assign"]) == 4

    body =
      post(context.conn, @api_path <> "/experiments", segments: %{lang: "ru", system: "windows"})
      |> json_response(200)
    assert length(body["assign"]) == 3

    body =
      post(context.conn, @api_path <> "/experiments", segments: %{lang: "ru"})
      |> json_response(200)
    assert length(body["assign"]) == 3

    body =
      post(context.conn, @api_path <> "/experiments", segments: %{lang: "ru", system: "osx"})
      |> json_response(200)
    assert length(body["assign"]) == 5
  end
end
