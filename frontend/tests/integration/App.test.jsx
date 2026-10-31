import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import App from "../../src/App";

it("cadastra um item e o exibe na lista", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByLabelText("Nome"), "Notebook");
  await user.type(screen.getByLabelText("Descrição"), "14 polegadas");
  await user.click(screen.getByRole("button", { name: "Adicionar" }));

  expect(screen.getByText("Notebook")).toBeInTheDocument();
  expect(screen.getByText("14 polegadas")).toBeInTheDocument();
  expect(screen.queryByText("Nenhum item cadastrado.")).not.toBeInTheDocument();
});

it("permite cadastrar mais de um item sem descrição", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByLabelText("Nome"), "Notebook");
  await user.click(screen.getByRole("button", { name: "Adicionar" }));
  await user.type(screen.getByLabelText("Nome"), "Mouse");
  await user.click(screen.getByRole("button", { name: "Adicionar" }));

  const items = screen.getAllByRole("listitem");
  expect(items).toHaveLength(2);
  expect(items[0]).toHaveTextContent("Notebook");
  expect(items[1]).toHaveTextContent("Mouse");
});

it("mantém a lista vazia com nome inválido e permite corrigir o cadastro", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByLabelText("Nome"), "   ");
  await user.click(screen.getByRole("button", { name: "Adicionar" }));

  expect(screen.getByRole("alert")).toHaveTextContent("O nome é obrigatório.");
  expect(screen.getByText("Nenhum item cadastrado.")).toBeInTheDocument();
  expect(screen.queryByRole("listitem")).not.toBeInTheDocument();

  await user.clear(screen.getByLabelText("Nome"));
  await user.type(screen.getByLabelText("Nome"), "Notebook");
  await user.click(screen.getByRole("button", { name: "Adicionar" }));

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByRole("listitem")).toHaveTextContent("Notebook");
});
