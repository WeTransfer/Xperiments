# defmodule Xperiments.Cms.Application.Policy do
#   @moduledoc """
#   Policy for application resources. Only admin can create/update and delete applciations.
#   """
#   alias Xperiments.Cms.User

#   def can?(%User{role: "admin"}, _action, _res), do: true

#   def can?(_user, :index, _res), do: true

#   def can?(_user, _action, _experiment), do: true
# end
