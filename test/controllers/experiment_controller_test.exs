defmodule Xperiments.ExperimentControllerTest do
  use Xperiments.ConnCase, async: false
  use Timex
  alias Xperiments.Experiment

  setup do
    conn =
      build_conn()
      |> put_req_header("accept", "application/json")

    app = insert(:application, name: "frontend")
    {:ok, conn: conn, app: app}
  end

  @api_path "/api/v1/applications/frontend"

  test "/create a draft experiment", context do
    draft_experiment = %{
      name: "Test experiment 1",
      description: "Some descriptions",
      sampling_rate: 100,
      max_users: 100,
      start_date: Timex.now |> Timex.shift(hours: 1) |> Timex.format!("{ISO:Extended:Z}"),
      end_date: Timex.now |> Timex.shift(days: 3) |> Timex.format!("{ISO:Extended:Z}")
    }
    body =
      post(context[:conn], "#{@api_path}/experiments", %{experiment: draft_experiment})
      |> json_response(201)
    experiment = Repo.get_by!(Experiment, name: draft_experiment.name)

    assert body["experiment"]["id"] == experiment.id
  end

  test "/update any experiment with embded data", context do
    exp_id = insert(:experiment).id
    variant = %{
      name: "Var A",
      allocation: 40,
      control_group: true,
      description: "",
      payload: "{}"
    }
    rule = %{
      parameter: "language",
      type: "string",
      operator: "==",
      value: "en"
    }
    updates = %{variants: [variant], rules: [rule]}
    response = put(context[:conn], @api_path <> "/experiments/" <> exp_id, %{experiment: updates})
    body = json_response(response, 200)

    assert body["experiment"]["id"] == exp_id
  end

  test "/index returns list of experiments", context do
    insert_list(3, :experiment, application: context.app)
    body =
      get(context[:conn], @api_path <> "/experiments")
      |> json_response(200)
    assert length(body["experiments"]) == 3
  end

  test "/state change state for a given experiemnt", context do
    exp = insert(:experiment)
    assert exp.state == "draft"
    body =
      put(context[:conn], @api_path <> "/experiments/" <> exp.id <> "/state", %{event: "run"})
      |> json_response(200)
    assert body["state"] == "running"
    assert Repo.get!(Experiment, exp.id).state == "running"
  end
end
