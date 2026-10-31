import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ItemList } from "../../src/components/ItemList";

it("mostra o estado vazio quando não há itens", () => {
  render(<ItemList items={[]} />);

  expect(screen.getByText("Nenhum item cadastrado.")).toBeInTheDocument();
  expect(screen.queryByRole("list")).not.toBeInTheDocument();
});

it("lista itens com e sem descrição", () => {
  render(
    <ItemList
      items={[
        { id: "1", name: "Notebook", description: "14 polegadas" },
        { id: "2", name: "Mouse", description: "" },
      ]}
    />,
  );

  expect(screen.getAllByRole("listitem")).toHaveLength(2);
  expect(screen.getByText("Notebook")).toBeInTheDocument();
  expect(screen.getByText("14 polegadas")).toBeInTheDocument();
  expect(screen.getByText("Mouse")).toBeInTheDocument();
  expect(screen.queryByText("Nenhum item cadastrado.")).not.toBeInTheDocument();
});
