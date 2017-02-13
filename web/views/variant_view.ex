defmodule Xperiments.VariantView do
  use Xperiments.Web, :view

  def render("show.json", %{variant: variant}) do
    %{variant: variant}
  end
end
