defmodule Xperiments.Rule do
  @moduledoc """
  Defines rules for a segmentation.

  A rule set in form:
  - *parameter*. String. Example: "region", "country", "lang", etc.
  - *type*. String. Can be only: "string", "number", "boolean"
  - *operator*. String. Can be only: "==", "!=", ">", "<", ">=", "<="
  - *value*. String. Example: "eu", "ru", "100", etc.
  """
  use Xperiments.Web, :model

  embedded_schema do
    field :parameter
    field :type, :string, default: "string"
    field :operator, :string, default: "=="
    field :value
  end

  @allowed_params ~w(parameter type operator value)a

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @allowed_params)
    |> validate_required(@allowed_params)
    |> validate_inclusion(:type, ~w(string number))
    |> validate_inclusion(:operator, ~w(== != > < >= <=))
  end

end
