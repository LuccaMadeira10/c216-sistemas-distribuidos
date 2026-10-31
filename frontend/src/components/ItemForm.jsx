import { useState } from "react";
import { validateItem } from "../validation";

export function ItemForm({ onAdd }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();
    const result = validateItem({ name, description });
    setErrors(result.errors);
    if (Object.keys(result.errors).length > 0) return;

    onAdd(result.values);
    setName("");
    setDescription("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="min-w-0 space-y-6 rounded-3xl border border-blue-100 bg-white/95 p-5 shadow-lg shadow-blue-900/5 sm:space-y-7 sm:p-8"
    >
      <div className="flex items-center gap-4 border-b border-blue-100 pb-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 sm:size-14">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="size-6 sm:size-8"
          >
            <path d="M12 4v16M4 12h16" />
          </svg>
        </span>
        <h2 className="text-xl font-bold sm:text-2xl xl:text-3xl">Novo item</h2>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-1">
            <label
              htmlFor="item-name"
              className="block text-sm font-semibold sm:text-xl"
            >
              Nome
            </label>
            <span aria-hidden="true" className="text-red-600">
              *
            </span>
          </div>
          <span className="text-xs text-slate-500 sm:text-lg">
            Até 100 caracteres
          </span>
        </div>
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-500 sm:size-6"
          >
            <path d="M20 13 13 20a2 2 0 0 1-2.8 0L3 12.8V3h9.8l7.2 7.2a2 2 0 0 1 0 2.8Z" />
            <circle cx="7.5" cy="7.5" r="1" />
          </svg>
          <input
            id="item-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-required="true"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "item-name-error" : undefined}
            placeholder="Ex.: Notebook"
            className="w-full rounded-2xl border border-slate-300 bg-white py-3 pr-4 pl-12 text-base text-slate-900 outline-none transition-colors placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100/70 aria-invalid:border-red-400 aria-invalid:bg-red-50/50 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-100 sm:py-4 sm:text-xl"
          />
        </div>
        {errors.name && (
          <p
            id="item-name-error"
            role="alert"
            className="text-sm leading-relaxed text-red-700"
          >
            {errors.name}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-4">
          <label
            htmlFor="item-description"
            className="block text-sm font-semibold sm:text-xl"
          >
            Descrição
          </label>
          <span className="text-xs text-slate-500 sm:text-lg">Opcional</span>
        </div>
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute top-4 left-4 size-5 text-slate-500 sm:size-6"
          >
            <path d="M14 3H5v18h14V8l-5-5Z" />
            <path d="M14 3v5h5M8 12h8M8 16h5" />
          </svg>
          <textarea
            id="item-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            placeholder="Adicione uma breve descrição"
            className="block w-full resize-y rounded-2xl border border-slate-300 bg-white py-3 pr-4 pl-12 text-base leading-6 text-slate-900 outline-none transition-colors placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100/70 sm:min-h-36 sm:text-xl"
          />
        </div>
      </div>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-md shadow-blue-600/10 transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-800 sm:py-5 sm:text-2xl"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="size-5 sm:size-6"
        >
          <path d="M12 4v16M4 12h16" />
        </svg>
        Adicionar
      </button>
    </form>
  );
}
