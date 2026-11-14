import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import App from "../../src/App";
import { API_URL } from "../../src/services/items";

function jsonResponse(data, ok = true) {
  return { ok, json: async () => data };
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([])));
});

it("cadastra um item e o exibe na lista", async () => {
  const user = userEvent.setup();
  render(<App />);

  await screen.findByText("Nenhum item cadastrado.");
  fetch.mockResolvedValueOnce(
    jsonResponse({ id: 1, name: "Notebook", description: "14 polegadas" }),
  );

  await user.type(screen.getByLabelText("Nome"), "Notebook");
  await user.type(screen.getByLabelText("Descrição"), "14 polegadas");
  await user.click(screen.getByRole("button", { name: "Adicionar" }));

  expect(screen.getByText("Notebook")).toBeInTheDocument();
  expect(screen.getByText("14 polegadas")).toBeInTheDocument();
  expect(screen.queryByText("Nenhum item cadastrado.")).not.toBeInTheDocument();
  expect(fetch).toHaveBeenLastCalledWith(`${API_URL}/items/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Notebook", description: "14 polegadas" }),
  });
});

it("permite cadastrar mais de um item sem descrição", async () => {
  const user = userEvent.setup();
  render(<App />);

  await screen.findByText("Nenhum item cadastrado.");
  fetch
    .mockResolvedValueOnce(
      jsonResponse({ id: 1, name: "Notebook", description: null }),
    )
    .mockResolvedValueOnce(
      jsonResponse({ id: 2, name: "Mouse", description: null }),
    );

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

  await screen.findByText("Nenhum item cadastrado.");

  await user.type(screen.getByLabelText("Nome"), "   ");
  await user.click(screen.getByRole("button", { name: "Adicionar" }));

  expect(screen.getByRole("alert")).toHaveTextContent("O nome é obrigatório.");
  expect(screen.getByText("Nenhum item cadastrado.")).toBeInTheDocument();
  expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  expect(fetch).toHaveBeenCalledTimes(1);

  fetch.mockResolvedValueOnce(
    jsonResponse({ id: 1, name: "Notebook", description: null }),
  );

  await user.clear(screen.getByLabelText("Nome"));
  await user.type(screen.getByLabelText("Nome"), "Notebook");
  await user.click(screen.getByRole("button", { name: "Adicionar" }));

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByRole("listitem")).toHaveTextContent("Notebook");
});

it("mostra carregamento antes da resposta da API", () => {
  fetch.mockReturnValue(new Promise(() => {}));
  render(<App />);

  expect(screen.getByRole("status")).toHaveTextContent("Carregando itens...");
  expect(screen.queryByText("Nenhum item cadastrado.")).not.toBeInTheDocument();
});

it("exibe os itens recebidos da API", async () => {
  fetch.mockResolvedValueOnce(
    jsonResponse([{ id: 7, name: "Caderno", description: "Material da aula" }]),
  );
  render(<App />);

  expect(await screen.findByRole("listitem")).toHaveTextContent("Caderno");
  expect(screen.getByRole("listitem")).toHaveTextContent("Material da aula");
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith(`${API_URL}/items/`, undefined);
});

it("mostra erro de conexão ao carregar os itens", async () => {
  fetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));
  render(<App />);

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Não foi possível conectar à API.",
  );
  expect(screen.queryByText("Nenhum item cadastrado.")).not.toBeInTheDocument();
});

it("mantém os campos e a lista quando a API rejeita um nome duplicado", async () => {
  const user = userEvent.setup();
  fetch
    .mockResolvedValueOnce(
      jsonResponse([{ id: 1, name: "Notebook", description: null }]),
    )
    .mockResolvedValueOnce(
      jsonResponse({ detail: "Já existe um item com esse nome" }, false),
    );
  render(<App />);
  await screen.findByRole("listitem");

  await user.type(screen.getByLabelText("Nome"), "Notebook");
  await user.type(screen.getByLabelText("Descrição"), "14 polegadas");
  await user.click(screen.getByRole("button", { name: "Adicionar" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Já existe um item com esse nome",
  );
  expect(screen.getByLabelText("Nome")).toHaveValue("Notebook");
  expect(screen.getByLabelText("Descrição")).toHaveValue("14 polegadas");
  expect(screen.getAllByRole("listitem")).toHaveLength(1);
  expect(screen.getByRole("button", { name: "Adicionar" })).toBeEnabled();
});
