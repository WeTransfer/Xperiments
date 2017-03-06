defmodule Xperiments.V1.ApplicationView do
  use Xperiments.Web, :view

  def render("index.json", %{applications: apps}) do
    %{applications: apps}
  end

end
