defmodule Xperiments.Web.V1.ApplicationView do
  use Xperiments.Web, :view

  def render("index.json", %{applications: apps}) do
    %{applications: apps}
  end

  def render("show.json", %{application: app}) do
    %{application: app}
  end
end
