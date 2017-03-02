Enum.each Application.get_env(:xperiments, :seed)[:applications], fn {app_name, app_settings} ->
  case Xperiments.Repo.insert(%Xperiments.Application{name: app_name, settings: app_settings}, on_conflict: :nothing) do
    {:ok, struct} ->
      IO.puts "New record is inserted (or did nothing, if it exists): #{inspect struct}"
    {:error, _} -> :ok
  end
end
