defmodule Xperiments.Web.V1.PayloadSchemaView do
  use Xperiments.Web, :view

  def render("index.json", %{schemas: schemas}) do
    %{schemas: schemas}
  end

  def render("show.json", %{schema: schema}) do
    %{schema: schema}
  end
end
