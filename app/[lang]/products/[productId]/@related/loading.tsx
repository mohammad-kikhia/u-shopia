export default function RelatedLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-6">
      <div className="mb-3 h-6 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="flex gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-[220px] shrink-0 rounded-2xl border border-slate-200/70 p-3 dark:border-slate-800">
            <div className="mb-2 aspect-square w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="mb-1 h-3 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

