export default function ProductsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="mb-6 h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200/70 p-3 dark:border-slate-800">
            <div className="mb-3 aspect-square w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

