defmodule Xperiments.SessionControllerTest do
  use Xperiments.Web.ConnCase, async: false
  alias Xperiments.User

  setup do
    conn = build_conn()
    params = params_for(:user, password: "123456")
    params = for {key, val} <- params, into: %{}, do: {Atom.to_string(key), val}
    {:ok, user} = User.changeset(%User{}, params) |> User.create()

    {:ok, conn: conn, user: user}
  end

  @api_url "/api/v1/sessions"

  test "successful login with a email and password", context do
    post(context.conn, @api_url, %{email: context.user.email, password: "123456"})
      |> json_response(:created)
  end

  test "show error if email or password is incorrect", context do
    body =
      post(context.conn, @api_url, %{email: "wrong@email", password: "000"})
      |> json_response(:forbidden)
    assert body == %{"errors" => "invalid user-identifier"}
  end
end
