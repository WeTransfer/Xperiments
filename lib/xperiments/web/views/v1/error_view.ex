defmodule Xperiments.Web.V1.ErrorView do
  use Xperiments.Web, :view

  def render("404.json", _assigns) do
    %{errors: %{detail: "Page not found"}}
  end

  def render("403.json", _assigns) do
    %{errors: %{message: "Forbidden"}}
  end

  def render("500.json", _assigns) do
    %{errors: %{details: "Internal server error"}}
  end

  def render("500.html", _assigns) do
    "Internal server error"
  end

  def render("error.json", %{changeset: changeset}) do
    # When encoded, the changeset returns its errors
    # as a JSON object. So we just pass it forward.
    errors = Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
    %{errors: errors}
  end

  def render("common_error.json", %{error: message}) do
    %{errors: message}
  end

  # In case no render clause matches or no
  # template is found, let's render it as 500
  def template_not_found(_template, assigns) do
    render "500.json", assigns
  end
end
