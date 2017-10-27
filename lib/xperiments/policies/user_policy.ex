# defmodule Xperiments.Cms.User.Policy do
#   @moduledoc """
#   Policy for user resources. Only admin can do any actions.
#   """
#   alias Xperiments.Cms.User

#   def can?(%User{role: "admin"}, _action, _res), do: true

#   def can?(_user, _action, _experiment), do: false
# end
