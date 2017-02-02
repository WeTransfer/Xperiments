defmodule Xperiments.ExperimentView do
  use Xperiments.Web, :view

  def render("show.json", %{experiment: exp}) do
    %{experiment: exp}
  end

end
