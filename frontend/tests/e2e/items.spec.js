import { expect, test } from "@playwright/test";

function uniqueName(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

test("carrega a interface com formulário e listagem da API", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Gerenciador de Itens" }),
  ).toBeVisible();
  await expect(page.getByLabel("Nome")).toBeVisible();
  await expect(page.getByLabel("Descrição")).toBeVisible();
  await expect(page.getByRole("button", { name: "Adicionar" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Itens cadastrados" }),
  ).toBeVisible();
  await expect(page.getByText("Carregando itens...")).toBeHidden();
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("mostra erro ao tentar cadastrar com nome vazio", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Carregando itens...")).toBeHidden();

  await page.getByRole("button", { name: "Adicionar" }).click();

  await expect(page.getByRole("alert")).toHaveText("O nome é obrigatório.");
  await expect(page.getByLabel("Nome")).toHaveAttribute("aria-invalid", "true");
});

test("cadastra um item e ele persiste após recarregar a página", async ({
  page,
}) => {
  const name = uniqueName("Notebook");
  await page.goto("/");
  await expect(page.getByText("Carregando itens...")).toBeHidden();

  await page.getByLabel("Nome").fill(name);
  await page.getByLabel("Descrição").fill("14 polegadas");
  await page.getByRole("button", { name: "Adicionar" }).click();

  const item = page.getByRole("listitem").filter({ hasText: name });
  await expect(item).toBeVisible();
  await expect(item).toContainText("14 polegadas");
  await expect(page.getByText("Nenhum item cadastrado.")).toBeHidden();
  await expect(page.getByLabel("Nome")).toHaveValue("");
  await expect(page.getByLabel("Descrição")).toHaveValue("");

  await page.reload();
  await expect(item).toBeVisible();
  await expect(item).toContainText("14 polegadas");
});

test("mostra a mensagem da API ao cadastrar um nome duplicado", async ({
  page,
}) => {
  const name = uniqueName("Mouse");
  await page.goto("/");
  await expect(page.getByText("Carregando itens...")).toBeHidden();
  await page.getByLabel("Nome").fill(name);
  await page.getByRole("button", { name: "Adicionar" }).click();
  const item = page.getByRole("listitem").filter({ hasText: name });
  await expect(item).toBeVisible();
  await expect(page.getByLabel("Nome")).toHaveValue("");

  await page.getByLabel("Nome").fill(name);
  await page.getByRole("button", { name: "Adicionar" }).click();

  await expect(page.getByRole("alert")).toHaveText(
    "Já existe um item com esse nome",
  );
  await expect(page.getByLabel("Nome")).toHaveValue(name);
  await expect(item).toHaveCount(1);
});
