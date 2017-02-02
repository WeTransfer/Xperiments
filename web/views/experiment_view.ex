defmodule Xperiments.ExperimentView do
  use Xperiments.Web, :view

  def render("show.json", %{experiment: exp}) do
    %{experiment: exp}
  end

  def render("index.json", %{experiments: experiments}) do
    %{experiments: render_many(experiments, __MODULE__, "show.json")}
  end
end
