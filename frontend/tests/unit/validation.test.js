import { describe, expect, it } from "vitest";
import { validateItem } from "../../src/validation";

describe("validateItem", () => {
  it.each(["", "   "])("rejeita nome vazio ou só com espaços: %j", (name) => {
    const { errors } = validateItem({ name, description: "" });
    expect(errors.name).toBe("O nome é obrigatório.");
  });

  it("rejeita nome com mais de 100 caracteres", () => {
    const { errors } = validateItem({ name: "a".repeat(101), description: "" });
    expect(errors.name).toBe("O nome deve ter no máximo 100 caracteres.");
  });

  it("aceita nome com 100 caracteres e descrição vazia", () => {
    const { errors, values } = validateItem({
      name: "a".repeat(100),
      description: "",
    });
    expect(errors).toEqual({});
    expect(values).toEqual({ name: "a".repeat(100), description: "" });
  });

  it("remove espaços nas extremidades do nome e da descrição", () => {
    const { errors, values } = validateItem({
      name: "  Notebook  ",
      description: "  14 polegadas  ",
    });
    expect(errors).toEqual({});
    expect(values).toEqual({ name: "Notebook", description: "14 polegadas" });
  });
});
