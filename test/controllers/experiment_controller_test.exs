defmodule Xperiments.Experiments.ExperimentControllerTest do
  use XperimentsWeb.ConnCase, async: false
  use Timex
  alias Xperiments.Experiments.Experiment

  setup do
    user = insert(:user)

    conn = sign_in(user)

    app = insert(:application, name: "frontend")
    {:ok, conn: conn, app: app, user: user}
  end

  def sign_in(user) do
    build_conn()
    |> bypass_through(Xperiments.Router, [:api, :browser])
    |> get("/auth/login")
    |> Map.update!(:state, fn (_) -> :set end)
    |> Guardian.Plug.sign_in(user, :token, [])
    |> send_resp(200, "Flush the session yo")
    |> recycle()
    |> put_req_header("accept", "application/json")
  end


  def insert_experiment(context) do
    insert(:experiment,
      application: context.app,
      start_date: Timex.now |> Timex.shift(days: 1),
      user: context.user)
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
    assert is_map(body["experiment"]["user"])
  end

  test "/show an experiment", context do
    exp = insert_experiment(context)
    body =
      get(context.conn, @api_path <> "/experiments/" <> exp.id)
      |> json_response(200)

    assert body["experiment"]["id"] == exp.id
    assert body["experiment"]["name"] == exp.name
  end

  test "/update any experiment with embded data", context do
    exp = insert_experiment(context)
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
    response = put(context[:conn], @api_path <> "/experiments/" <> exp.id, %{experiment: updates})
    body = json_response(response, 200)

    assert body["experiment"]["id"] == exp.id
  end

  test "/update returns errors when bad data is given", context do
    exp_id = insert_experiment(context).id
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

  test "authorization for udpate and change_state actions", context do
    exp = insert_experiment(%{user: insert(:user), app: context.app})
    updates = %{name: "Supre Experiment"}

    put(context.conn, @api_path <> "/experiments/" <> exp.id, %{experiment: updates})
    |> json_response(403)

    put(context.conn, @api_path <> "/experiments/" <> exp.id <> "/state", %{event: "run"})
    |> json_response(403)
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
    admin = insert(:user, role: "admin")
    exp = insert(:experiment, application: context.app, variants: [%{ Xperiments.Factory.variant() | control_group: true }], start_date: Timex.now() |> Timex.shift(days: 1), user: context.user)
    assert exp.state == "draft"

    conn = sign_in(admin)
    body =
      put(conn, @api_path <> "/experiments/" <> exp.id <> "/state", %{event: "run"})
      |> json_response(200)
    assert body["state"] == "running"
    assert Repo.get!(Experiment, exp.id).state == "running"
  end

  test "/state returns an error if given an unsupported state", context do
    exp = insert_experiment(context)
    body =
      put(context[:conn], @api_path <> "/experiments/" <> exp.id <> "/state", %{event: "bad_event"})
      |> json_response(400)
    assert body["errors"] == %{"details" => "unsupported event"}
  end

  test "/state returns an error if we try to make an unsupported transittion", context do
    exp = insert_experiment(context)
    body =
      put(context[:conn], @api_path <> "/experiments/" <> exp.id <> "/state", %{event: "stop"})
      |> json_response(422)
    assert body["errors"] == %{"state" => ["You can't move state from :draft to :stopped"]}
  end

  test "/update add an exclusions associacion if exclusions are given", context do
    exp = insert_experiment(context)
    exclusions = insert_list(3, :experiment, application: context.app) |> Enum.map(& &1.id)
    removed_experiments = insert_list(3, :experiment, application: context.app, state: "deleted") |> Enum.map(& &1.id)
    body =
      put(context.conn, @api_path <> "/experiments/" <> exp.id, %{experiment:
                                                                  %{exclusions: exclusions ++ removed_experiments}})
                                                                  |> json_response(200)
    assert body["experiment"]["exclusions"] == exclusions
  end

  test "replaces a whole exclusions list on update", context do
    exclusions = insert_list(3, :experiment, application: context.app, start_date: Timex.shift(Timex.now, days: 1))
    exp = insert(:experiment, user: context.user, application: context.app, exclusions: exclusions, start_date: Timex.shift(Timex.now, days: 1))
    body =
      put(context.conn, @api_path <> "/experiments/" <> exp.id, %{experiment: %{exclusions: []}})
      |> json_response(200)
    assert body["experiment"]["exclusions"] == []
  end

  test "return an error if given application is not exists for any requests", context do
    bad_path =  "/api/v1/applications/wrong_app/experiments"
    body =
      get(context.conn, bad_path)
      |> json_response(422)
    assert body["errors"] == %{"application" => "The application wrong_app doesn't exists"}
  end

  test "/variant returns a variant", context do
    exp = insert(:experiment)
    variant = List.first(exp.variants)
    body =
      get(context.conn, @api_path <> "/experiments/" <> exp.id <> "/variant/" <> variant.id)
      |> json_response(200)
    assert body["variant"]["id"] == variant.id
  end

  test "/variant returns error if requested veriant is not in the given experiment", context do
    exp = insert(:experiment)
    body =
      get(context.conn, @api_path <> "/experiments/" <> exp.id <> "/variant/" <> "bad_id")
      |> json_response(404)
    assert body["errors"] == %{"experiment" => "Variant with id 'bad_id' for the experiment with id '#{exp.id}' is not found"}
  end

  describe "Pub/Sub broadcaster" do
    import Mock
    alias Xperiments.BroadcastService

    def admin_conn do
      sign_in(insert(:user, role: "admin"))
    end


    def insert_runnable_experiment(context, state \\ "draft") do
      insert(:experiment, state: state, variants: [%{Xperiments.Factory.variant(100) | control_group: true}], start_date: Timex.now |> Timex.shift(days: 1), user: context.user)
    end

    test "broadcast correct messages when we run an experiment", context do
      exp = insert_runnable_experiment(context)
      with_mock BroadcastService, [broadcast_state_changes: fn(_, _, _) -> :ok end] do
        put(admin_conn(), "#{@api_path}/experiments/#{exp.id}/state", %{event: "run"})
        |> json_response(200)

        assert called BroadcastService.broadcast_state_changes("draft", "running", :_)
      end
    end

    test "broadcast correct messages when we stop an experiment", context do
      exp = insert_runnable_experiment(context, "running")
      with_mock BroadcastService, [broadcast_state_changes: fn(_, _, _) -> :ok end] do
        put(admin_conn(), "#{@api_path}/experiments/#{exp.id}/state", %{event: "stop"})
        |> json_response(200)

        assert called BroadcastService.broadcast_state_changes("running", "stopped", :_)
      end
    end

    test "broadcast correct messages when we terminate an experiment", context do
      exp = insert_runnable_experiment(context, "stopped")
      with_mock BroadcastService, [broadcast_state_changes: fn(_, _, _) -> :ok end] do
        put(admin_conn(), "#{@api_path}/experiments/#{exp.id}/state", %{event: "terminate"})
        |> json_response(200)

        assert called BroadcastService.broadcast_state_changes("stopped", "terminated", :_)
      end
    end
  end
end
