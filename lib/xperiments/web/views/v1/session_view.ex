defmodule Xperiments.Web.V1.SessionView do
  use Xperiments.Web, :view

  def render("create.json", %{user: user}) do
    %{user: user}
  end
end
