defmodule Xperiments.Variant do
  use Xperiments.Web, :model

  embedded_schema do
    field :name
    field :allocation, :integer
    field :control_group, :boolean
    field :description
    field :payload
  end
end
