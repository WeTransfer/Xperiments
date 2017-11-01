defmodule XperimentsWeb.V1.UserView do
  use XperimentsWeb, :view

  def render("index.json", %{users: users}) do
    %{users: users}
  end

  def render("show.json", %{user: user}) do
    %{user: user}
  end
end
