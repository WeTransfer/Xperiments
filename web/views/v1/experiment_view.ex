defmodule Xperiments.V1.ExperimentView do
  use Xperiments.Web, :view

  def render("show.json", %{experiment: exp}) do
    %{experiment: exp}
  end

  def render("index.json", %{experiments: experiments}) do
    %{experiments: experiments}
  end

  def render("state.json", %{state: state}) do
    %{state: state}
  end

  def render("exclusions.json", %{exclusions: exclusions, id: id}) do
    %{"#{id}" => exclusions}
  end
end
