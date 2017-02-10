defmodule Xperiments.AssignerController do
  use Xperiments.Web, :controller

  def experiments(conn, params) do
    experiments = Xperiments.Assigner.Dispatcher.return_suitable_experiments(0, [])
    render conn, "experiments.json", experiments: experiments
  end
end
