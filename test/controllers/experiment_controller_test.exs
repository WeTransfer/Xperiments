defmodule Xperiments.ExperimentControllerTest do
  use Xperiments.ConnCase, async: false
  use Timex
  alias Xperiments.Experiment

  setup do
    conn =
      build_conn()
      |> put_req_header("accept", "application/json")

    insert(:application, name: "frontend")
    {:ok, conn: conn}
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
    response = post(context[:conn], "#{@api_path}/experiments", %{experiment: draft_experiment})
    body = json_response(response, 201)
    experiment = Repo.get_by!(Experiment, name: draft_experiment.name)

    assert body["experiment"]["id"] == experiment.id
  end
end
