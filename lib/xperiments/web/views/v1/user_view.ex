defmodule Xperiments.Web.V1.UserView do
  use Xperiments.Web, :view

  def render("index.json", %{users: users}) do
    %{users: users}
  end

  def render("show.json", %{user: user}) do
    %{user: user}
  end
end
