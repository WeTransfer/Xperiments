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

  @primary_key false
  embedded_schema do
    field :parameter
    field :type, :string
    field :operator, :string
    field :value
  end

  @allowed_params ~w(parameter type operator value)a

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @allowed_params)
    |> validate_required(@allowed_params)
    |> validate_inclusion(:type, ~w(string number boolean))
    |> validate_inclusion(:operator, ~w(== != > < >= <=))
    |> validate_string_type()
    |> validate_boolean_type()
  end

  def validate_string_type(chset) do
    changes = chset.changes
    if changes[:type] == "string" and not changes[:operator] in ["==", "!="] do
      add_error(chset, :type, "For String types only '==' and '!=' operators are allowed")
    else
      chset
    end
  end

  def validate_boolean_type(chset) do
    changes = chset.changes
    if changes[:type] == "boolean" and changes[:operator] != "==" and not changes[:value] in ["true", "false"]  do
      add_error(chset, :type, "Boolean type must have only '==' operator and value should be 'true' or 'false'")
    else
      chset
    end
  end
end
