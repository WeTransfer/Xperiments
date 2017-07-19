defmodule Xperiments.AssignerControllerTest do
  use Xperiments.Web.ConnCase, async: false
  import Mock
  alias Xperiments.Assigner.ExperimentSupervisor

  @api_path "/assigner/application/test_app"

  setup do
    for e_pid <- ExperimentSupervisor.experiment_pids() do
      Supervisor.terminate_child(ExperimentSupervisor, e_pid)
    end
    app = insert(:application, name: "test_app")
    build_and_run_experiments(3, state: "running", application: app)
    conn =
      build_conn()
      |> put_req_header("accept", "application/json")
      |> put_req_header("x-forwarded-for", "for=127.0.0.1")

    on_exit fn ->
      ExRated.delete_bucket("127.0.0.1:assigner/application/test_app/experiments/events")
    end

    [conn: conn, app: app]
  end

  def build_and_run_experiments(quantity, opts) do
    for _i <- 1..quantity do
      build(:experiment, opts)
      |> Xperiments.Factory.with_balanced_variants
      |> insert
      |> Xperiments.Assigner.ExperimentSupervisor.start_experiment
    end
  end

  def run_experiments_with_rules(context) do
    build_and_run_experiments(2, state: "running", application: context.app, rules: Xperiments.Factory.rules_1)
    build_and_run_experiments(1, state: "running", application: context.app, rules: Xperiments.Factory.rules_2)
  end

  test "/experiments returns assigner variants", context do
    body =
      post(context.conn, @api_path <> "/experiments", %{})
      |> json_response(200)
    assert length(body["assign"]) == 3
    assert hd(body["assign"])["name"] # test that we return a name of a requested experiment
    ids =
      Xperiments.Repo.all(Xperiments.Experiment)
      |> Enum.map(& &1.id)
    returned_ids = body["assign"] |> Enum.map(fn e -> e["id"] end)
    assert Enum.sort(returned_ids) == Enum.sort(ids)
  end

  test "returning of a specific variant", context do
    exp = insert(:experiment)
    var = hd(exp.variants)
    salt = Application.get_env(:xperiments, Xperiments.Web.Endpoint)[:secret_key_base]
    token = Phoenix.Token.sign(Xperiments.Web.Endpoint, salt, 1)

    # without a token
    get(context.conn, "#{@api_path}/experiments/#{exp.id}/variants/#{var.id}")
    |> json_response(403)

    # with a token
    body =
      get(context.conn, "#{@api_path}/experiments/#{exp.id}/variants/#{var.id}?token=#{token}")
      |> json_response(200)
    assert hd(body["assign"])["id"] == exp.id
  end

  describe "Impreassions" do
    setup context do
      exp = hd(Xperiments.Repo.all(Xperiments.Experiment))
      [
        conn: context.conn,
        exp: exp,
        call_payload: %{experiment_id: exp.id, variant_id: hd(exp.variants).id}
      ]
    end

    test "impressions call", context do
      with_mock Xperiments.BroadcastService, [broadcast_impression: fn(_, _) -> :ok end] do
        post(context.conn, "#{@api_path}/experiments/events", %{event: "impression", payload: context.call_payload})
        |> json_response(200)

        assert called Xperiments.BroadcastService.broadcast_impression(context.exp.id, hd(context.exp.variants).id)
      end
    end

    test "saving statistics data to DB after we reach a trashhold", context do
      for _i <- 0..4 do
        post(context.conn, "#{@api_path}/experiments/events", %{event: "impression", payload: context.call_payload})
        |> json_response(200)
      end
      :timer.sleep 100 # yep, async tests are hard
      db_exp = Xperiments.Repo.get!(Xperiments.Experiment, context.exp.id)
      assert db_exp.statistics.common_impression == 4
      assert db_exp.statistics.variants_impression == %{hd(context.exp.variants).id => 4}
    end

    test "requests are throttled", context do
      for _i <- 0..4 do
        post(context.conn, "#{@api_path}/experiments/events", %{event: "impression", payload: context.call_payload})
        |> json_response(200)
      end
      body =
        post(context.conn, "#{@api_path}/experiments/events", %{event: "impression", payload: context.call_payload})
      |> json_response(403)
      assert body == %{"error" => "Rate limit exceeded"}
    end
  end

  describe "Rules/Segments logic" do
    setup :run_experiments_with_rules

    test "assigning one additional experiment with", context do
      body =
        post(context.conn, @api_path <> "/experiments", segments: %{lang: "en"})
        |> json_response(200)
      assert length(body["assign"]) == 4
    end

    test "one wrong segment", context do
      body =
        post(context.conn, @api_path <> "/experiments", segments: %{lang: "ru", system: "windows"})
        |> json_response(200)
      assert length(body["assign"]) == 3

    end
    test "one segment for an experiment with two rules", context do
      body =
        post(context.conn, @api_path <> "/experiments", segments: %{lang: "ru"})
        |> json_response(200)
      assert length(body["assign"]) == 3
    end

    test "segments which works for all running experiments with rules", context do
      body =
        post(context.conn, @api_path <> "/experiments", segments: %{lang: "ru", system: "osx"})
        |> json_response(200)
      assert length(body["assign"]) == 5
    end
  end
end
