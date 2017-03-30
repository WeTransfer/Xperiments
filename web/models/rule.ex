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
    params = make_value_as_string(params)
    struct
    |> cast(params, @allowed_params)
    |> validate_required(@allowed_params)
    |> validate_inclusion(:type, ~w(string number boolean))
    |> validate_inclusion(:operator, ~w(== != > < >= <=))
    |> validate_string_type()
    |> validate_boolean_type()
    |> validate_number_for_type_number()
    |> downcase_parameter()
  end

  def make_value_as_string(%{"value" => val} = params) when not is_nil(val) and is_number(val) do
    Map.update!(params, "value", &to_string(&1))
  end
  def make_value_as_string(params), do: params


  def validate_string_type(chset) do
    changes = chset.changes
    if changes[:type] == "string" and not changes[:operator] in ["==", "!="] do
      add_error(chset, :type, "string types must have only '==' and '!=' operators")
    else
      chset
    end
  end

  def validate_boolean_type(chset) do
    changes = chset.changes
    if changes[:type] == "boolean" and changes[:operator] != "==" and not changes[:value] in ["true", "false"]  do
      add_error(chset, :type, "boolean type must have only '==' operator and value must be 'true' or 'false'")
    else
      chset
    end
  end

  def validate_number_for_type_number(chset) do
    integer_parse_validation = fn(str) ->
      case Integer.parse(str) do
        {_num, _} -> true
        :error -> false
      end
    end
    if chset.changes[:type] == "number" and not integer_parse_validation.(chset.changes[:value]) do
      add_error(chset, :value, "must be a number")
    else
      chset
    end
  end

  def downcase_parameter(chset) do
    if parameter = chset.changes[:parameter] do
      change(chset, parameter: String.downcase(parameter))
    else
      chset
    end
  end
end
