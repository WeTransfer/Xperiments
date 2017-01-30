defmodule Xperiments.Rule do
  use Xperiments.Web, :model

  embedded_schema do
    field :parameter
    field :operator
    field :value
  end
end
