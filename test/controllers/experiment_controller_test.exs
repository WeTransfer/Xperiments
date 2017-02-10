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

  test "/show an experiment", context do
    exp = insert(:experiment, application: context.app)
    body =
      get(context.conn, @api_path <> "/experiments/" <> exp.id)
      |> json_response(200)

    assert body["experiment"]["id"] == exp.id
    assert body["experiment"]["name"] == exp.name
  end

  test "/update any experiment with embded data", context do
    exp_id = insert(:experiment, application: context.app).id
    variant = %{
      name: "Var A",
      allocation: 100,
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

  test "/update returns errors when bad data is given", context do
    exp_id = insert(:experiment, application: context.app).id
    variant = %{
      name: "Var A",
      allocation: 0,
      control_group: true,
      payload: "{}"
    }
    rule = %{
      parameter: "language",
      type: "bad_type",
      operator: "==",
      value: "en"
    }
    updates = %{variants: [variant], rules: [rule], sampling_rate: 200}
    body =
      put(context[:conn], @api_path <> "/experiments/" <> exp_id, %{experiment: updates})
      |> json_response(422)

    assert body == %{"errors" => %{"rules" => [%{"type" => ["is invalid"]}],
                                   "sampling_rate" => ["must be less than or equal to 100"],
                                   "variants" => [%{}, %{"allocation" => ["must be greater than 0"]}]}}
  end

  test "/index returns a list of experiments, except those which are in a deleted state", context do
    insert_list(3, :experiment, application: context.app)
    insert(:experiment, application: context.app, state: "deleted")
    body =
      get(context[:conn], @api_path <> "/experiments")
      |> json_response(200)
    assert length(body["experiments"]) == 3
  end

  test "/state changes state for a given experiemnt", context do
    exp = insert(:experiment, application: context.app)
    assert exp.state == "draft"
    body =
      put(context[:conn], @api_path <> "/experiments/" <> exp.id <> "/state", %{event: "run"})
      |> json_response(200)
    assert body["state"] == "running"
    assert Repo.get!(Experiment, exp.id).state == "running"
  end

  test "/state returns an error if given an unsupported state", context do
    exp = insert(:experiment, application: context[:app])
    body =
      put(context[:conn], @api_path <> "/experiments/" <> exp.id <> "/state", %{event: "bad_event"})
      |> json_response(400)
    assert body["errors"] == %{"details" => "unsupported event"}
  end

  test "/state returns an error if we try to make an unsupported transittion", context do
    exp = insert(:experiment, application: context[:app])
    body =
      put(context[:conn], @api_path <> "/experiments/" <> exp.id <> "/state", %{event: "stop"})
      |> json_response(422)
    assert body["errors"] == %{"state" => ["You can't move state from :draft to :stopped"]}
  end
end
