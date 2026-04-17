'use client';

export default function RelatedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-6">
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-600 dark:text-red-400">
        <p className="text-sm">Failed to load related products.</p>
        <button
          onClick={reset}
          className="mt-2 inline-flex rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

