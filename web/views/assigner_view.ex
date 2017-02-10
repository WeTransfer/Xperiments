defmodule Xperiments.AssignerView do
  use Xperiments.Web, :view

  def render("experiments.json", %{experiments: experiments}) do
    for e <- experiments, into: %{} do
      {
        e.id,
        %{
          name: e.name,
          start_date: e.start_date,
          end_date: e.end_date,
          variant: e.variant
        }
      }
    end
  end
end
