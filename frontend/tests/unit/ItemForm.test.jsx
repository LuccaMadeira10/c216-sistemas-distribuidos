import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { ItemForm } from "../../src/components/ItemForm";

it("mostra erro e não chama onAdd com nome vazio", async () => {
  const user = userEvent.setup();
  const onAdd = vi.fn();
  render(<ItemForm onAdd={onAdd} />);

  await user.click(screen.getByRole("button", { name: "Adicionar" }));

  expect(screen.getByRole("alert")).toHaveTextContent("O nome é obrigatório.");
  expect(screen.getByLabelText("Nome")).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByLabelText("Nome")).toHaveAccessibleDescription(
    "O nome é obrigatório.",
  );
  expect(onAdd).not.toHaveBeenCalled();
});

it("não chama onAdd quando o nome ultrapassa 100 caracteres", async () => {
  const user = userEvent.setup();
  const onAdd = vi.fn();
  render(<ItemForm onAdd={onAdd} />);

  await user.type(screen.getByLabelText("Nome"), "a".repeat(101));
  await user.click(screen.getByRole("button", { name: "Adicionar" }));

  expect(screen.getByRole("alert")).toHaveTextContent(
    "O nome deve ter no máximo 100 caracteres.",
  );
  expect(onAdd).not.toHaveBeenCalled();
});

it("envia os valores sem espaços nas extremidades e limpa o formulário", async () => {
  const user = userEvent.setup();
  const onAdd = vi.fn();
  render(<ItemForm onAdd={onAdd} />);

  await user.type(screen.getByLabelText("Nome"), "  Notebook  ");
  await user.type(screen.getByLabelText("Descrição"), "  14 polegadas  ");
  await user.click(screen.getByRole("button", { name: "Adicionar" }));

  expect(onAdd).toHaveBeenCalledExactlyOnceWith({
    name: "Notebook",
    description: "14 polegadas",
  });
  expect(screen.getByLabelText("Nome")).toHaveValue("");
  expect(screen.getByLabelText("Descrição")).toHaveValue("");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
