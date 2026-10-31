export function ItemList({ items }) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 px-5 py-8 text-center">
        <p className="font-medium text-slate-700">Nenhum item cadastrado.</p>
        <p className="text-sm leading-relaxed text-slate-500">
          Os itens adicionados aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:gap-6 sm:p-5"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 sm:size-14">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-6 sm:size-8"
            >
              <path d="m12 3 9 5-9 5-9-5 9-5Z" />
              <path d="M3 8v9l9 5 9-5V8M12 13v9" />
            </svg>
          </span>
          <div className="min-w-0 space-y-1 [overflow-wrap:anywhere]">
            <p className="text-base font-bold leading-relaxed text-slate-950 sm:text-xl xl:text-2xl">
              {item.name}
            </p>
            {item.description && (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 sm:text-lg">
                {item.description}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
