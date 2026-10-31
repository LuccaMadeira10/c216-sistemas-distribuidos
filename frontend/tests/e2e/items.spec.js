import { expect, test } from "@playwright/test";

test("carrega a interface com formulário e listagem vazia", async ({
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
  await expect(page.getByText("Nenhum item cadastrado.")).toBeVisible();
});

test("mostra erro ao tentar cadastrar com nome vazio", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Adicionar" }).click();

  await expect(page.getByRole("alert")).toHaveText("O nome é obrigatório.");
  await expect(page.getByLabel("Nome")).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Nenhum item cadastrado.")).toBeVisible();
  await expect(page.getByRole("listitem")).toHaveCount(0);
});

test("cadastra um item e o exibe na listagem", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Nome").fill("Notebook");
  await page.getByLabel("Descrição").fill("14 polegadas");
  await page.getByRole("button", { name: "Adicionar" }).click();

  await expect(page.getByRole("listitem")).toContainText("Notebook");
  await expect(page.getByRole("listitem")).toContainText("14 polegadas");
  await expect(page.getByText("Nenhum item cadastrado.")).toBeHidden();
  await expect(page.getByLabel("Nome")).toHaveValue("");
  await expect(page.getByLabel("Descrição")).toHaveValue("");
});
