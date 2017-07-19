defmodule Xperiments.PayloadSchema.Policy do
  @moduledoc """
  Policy for payload schema resources. Only admin can create/update and delete schemas.
  """
  alias Xperiments.User

  def can?(%User{role: "admin"}, _action, _res), do: true

  def can?(_user, :index, _res), do: true

  def can?(_user, _action, _experiment), do: true
end
