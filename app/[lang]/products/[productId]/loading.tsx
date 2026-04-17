export default function ProductDetailsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="aspect-square w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-3">
          <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-24 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-10 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

