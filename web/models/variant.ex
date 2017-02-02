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

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @allowed_params)
    |> validate_required(List.delete(@allowed_params, :control_group) |> List.delete(:description))
    |> validate_number(:allocation, greater_than: 0, less_than_or_equal_to: 100)
  end

end
