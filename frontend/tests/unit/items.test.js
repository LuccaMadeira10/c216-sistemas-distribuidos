import { beforeEach, expect, it, vi } from "vitest";
import { API_URL, createItem, listItems } from "../../src/services/items";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

it("lista os itens usando a rota com barra final", async () => {
  const items = [{ id: 1, name: "Notebook", description: null }];
  fetch.mockResolvedValue({ ok: true, json: async () => items });

  await expect(listItems()).resolves.toEqual(items);
  expect(fetch).toHaveBeenCalledWith(`${API_URL}/items/`, undefined);
});

it("envia o cadastro e converte descrição vazia em null", async () => {
  const item = { id: 1, name: "Notebook", description: null };
  fetch.mockResolvedValue({ ok: true, json: async () => item });

  await expect(
    createItem({ name: "Notebook", description: "" }),
  ).resolves.toEqual(item);
  expect(fetch).toHaveBeenCalledWith(`${API_URL}/items/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Notebook", description: null }),
  });
});

it("informa quando não consegue conectar à API", async () => {
  fetch.mockRejectedValue(new TypeError("Failed to fetch"));

  await expect(listItems()).rejects.toThrow("Não foi possível conectar à API.");
});

it("repassa a mensagem de nome duplicado da API", async () => {
  fetch.mockResolvedValue({
    ok: false,
    status: 409,
    json: async () => ({ detail: "Já existe um item com esse nome" }),
  });

  await expect(createItem({ name: "Notebook" })).rejects.toThrow(
    "Já existe um item com esse nome",
  );
});

it("usa a mensagem padrão quando detail não é um texto", async () => {
  fetch.mockResolvedValue({
    ok: false,
    status: 422,
    json: async () => ({ detail: [{ msg: "Valor inválido" }] }),
  });

  await expect(createItem({ name: "Notebook" })).rejects.toThrow(
    "Erro ao cadastrar o item.",
  );
});

it("usa a mensagem padrão quando a resposta de erro não é JSON", async () => {
  fetch.mockResolvedValue({
    ok: false,
    status: 500,
    json: async () => {
      throw new SyntaxError("JSON inválido");
    },
  });

  await expect(listItems()).rejects.toThrow("Erro ao carregar os itens.");
});
