defmodule XperimentsWeb.V1.VariantView do
  use XperimentsWeb, :view

  def render("show.json", %{variant: variant}) do
    %{variant: variant}
  end
end
