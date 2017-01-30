defmodule Xperiments.ExperimentTest do
  use Xperiments.ModelCase

  alias Xperiments.Experiment

  @valid_attrs %{description: "some content", end_date: %{day: 17, hour: 14, min: 0, month: 4, sec: 0, year: 2010}, max_users: 42, name: "some content", sampling_rate: "120.5", start_date: %{day: 17, hour: 14, min: 0, month: 4, sec: 0, year: 2010}}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Experiment.changeset(%Experiment{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Experiment.changeset(%Experiment{}, @invalid_attrs)
    refute changeset.valid?
  end
end
