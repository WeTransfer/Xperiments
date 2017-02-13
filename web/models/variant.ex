defmodule Xperiments.Variant do
  @moduledoc """
  Describe variants for an experiment.
  Control group can be set only for one variant.
  """
  use Xperiments.Web, :model

  embedded_schema do
    field :name
    field :allocation, :integer
    field :control_group, :boolean, default: false
    field :description
    field :payload
  end

  @allowed_params ~w(name allocation control_group description payload)a
  @require_params ~w(name allocation)a

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @allowed_params)
    |> validate_required(@require_params)
    |> validate_required_not_control_group(:payload)
    |> validate_number(:allocation, greater_than: 0, less_than_or_equal_to: 100)
  end

  def validate_required_not_control_group(changeset, field) do
    control_group = Map.get(changeset.changes, :control_group) || Map.get(changeset.data, :control_group)
    if control_group do
      changeset
    else
      validate_required(changeset, [field])
    end
  end
end
