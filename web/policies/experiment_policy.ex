defmodule Xperiments.Experiment.Policy do
  alias Xperiments.{User, Experiment}

  def can?(%User{role: :admin}, _action, _res), do: true

  def can?(%User{id: user_id}, action, %Experiment{user_id: experiment_user_id})
  when user_id != experiment_user_id and action in [:update, :change_state], do: false

  def can?(_user, _action, _experiment), do: true
end
