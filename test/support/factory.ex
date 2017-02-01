defmodule Xperiments.Factory do
  use ExMachina.Ecto, repo: Xperiments.Repo
  use Timex

  def user_factory do
    %Xperiments.User{
      name: "Lev",
      email: "lev.tolstoy@wetransfer.com"
    }
  end

  def application_factory do
    %Xperiments.Application{
      name: "frontend"
    }
  end

  def experiment_factory do
    %Xperiments.Experiment{
      name: "Experiment 1",
      description: "Change some text",
      start_date: Timex.now(),
      end_date: Timex.shift(Timex.now(), days: 3),
      max_users: 100,
      application: build(:application),
      user: build(:user)
    }
  end


end
