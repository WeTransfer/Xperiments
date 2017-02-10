defmodule Xperiments.AssignerControllerTest do
  use Xperiments.ConnCase, async: false

  setup do
    app = insert(:application, name: "test_app")
    for _i <- 0..2 do
      build(:experiment, state: "running", application: app)
      |> Xperiments.Factory.with_balanced_variants
      |> insert
      |> Xperiments.Assigner.Manager.start_experiment
    end
    conn =
      build_conn()
      |> put_req_header("accept", "application/json")
    [conn: conn]
  end

  @api_path "/assigner/application/test_app"

  test "/experiments returns assigner variants", context do
    body =
      get(context.conn, @api_path <> "/experiments")
      |> json_response(200)
    assert Map.size(body) == 3
    ids =
      Xperiments.Repo.all(Xperiments.Experiment)
      |> Enum.map(& &1.id)
    assert Enum.sort(Map.keys(body)) == Enum.sort(ids)
  end

end
