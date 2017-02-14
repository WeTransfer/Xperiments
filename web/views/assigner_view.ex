defmodule Xperiments.AssignerView do
  use Xperiments.Web, :view

  def render("experiments.json", %{experiments: experiments}) do
    experiments
  end
end
