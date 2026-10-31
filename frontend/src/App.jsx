import { useState } from "react";
import { ItemForm } from "./components/ItemForm";
import { ItemList } from "./components/ItemList";

export default function App() {
  const [items, setItems] = useState([]);

  function addItem({ name, description }) {
    setItems((current) => [
      ...current,
      { id: crypto.randomUUID(), name, description },
    ]);
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-linear-to-br from-blue-50 via-slate-50 to-blue-50 text-slate-950">
      <svg
        aria-hidden="true"
        viewBox="0 0 640 400"
        preserveAspectRatio="none"
        className="pointer-events-none absolute top-0 right-0 -z-10 h-96 w-xl text-blue-100/60 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]"
      >
        <path
          fill="currentColor"
          d="M390 0C300 95 260 145 130 200S30 300 0 400H640V0Z"
        />
        <path
          fill="currentColor"
          d="M640 70C470 100 400 205 300 280S180 360 150 400H640Z"
        />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 320 130"
        className="pointer-events-none absolute bottom-0 left-0 -z-10 h-32 w-80 text-blue-100/70"
      >
        <path fill="currentColor" d="M0 0C100 30 150 130 320 130H0Z" />
      </svg>
      <main className="mx-auto max-w-380 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <header className="mb-10 flex items-center gap-4 sm:mb-14 sm:gap-7">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/15 sm:size-20 sm:rounded-3xl">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-8 sm:size-11"
            >
              <path d="m12 3 10 5-10 5L2 8l10-5Z" />
              <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
            </svg>
          </div>
          <div className="min-w-0 space-y-2 border-l border-blue-200 pl-4 sm:space-y-3 sm:pl-7">
            <h1 className="text-2xl font-bold tracking-tight sm:text-4xl xl:text-5xl">
              Gerenciador de Itens
            </h1>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-lg xl:text-2xl">
              Cadastre e consulte seus itens de forma simples.
            </p>
          </div>
        </header>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-7">
          <ItemForm onAdd={addItem} />
          <section
            aria-labelledby="items-heading"
            className="min-w-0 space-y-6 rounded-3xl border border-blue-100 bg-white/95 p-5 shadow-lg shadow-blue-900/5 sm:p-8"
          >
            <div className="flex flex-wrap items-center gap-3 border-b border-blue-100 pb-5 sm:gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 sm:size-14">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="size-6 sm:size-7"
                >
                  <path d="M9 6h12M9 12h12M9 18h12" />
                  <path d="M3 6h.01M3 12h.01M3 18h.01" strokeWidth="3" />
                </svg>
              </span>
              <h2
                id="items-heading"
                className="text-lg font-bold sm:text-2xl xl:text-3xl"
              >
                Itens cadastrados
              </h2>
              <span
                title="Quantidade de itens cadastrados"
                className="rounded-full bg-blue-100 px-3 py-1 text-base font-semibold text-blue-600 sm:text-xl"
              >
                {items.length}
              </span>
            </div>
            <ItemList items={items} />
          </section>
        </div>
        <p className="mt-7 flex items-start gap-2 text-sm leading-relaxed text-blue-900/80 sm:mt-9 sm:gap-3 sm:px-3 sm:text-lg">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="mt-0.5 size-5 shrink-0 sm:size-6"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v6M12 7h.01" />
          </svg>
          Os dados são temporários e serão apagados ao atualizar a página.
        </p>
      </main>
    </div>
  );
}
