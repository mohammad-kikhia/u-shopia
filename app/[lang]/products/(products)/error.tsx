'use client';

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12 text-center">
      <h2 className="text-lg font-semibold">Something went wrong loading products.</h2>
      <p className="mt-2 text-sm text-muted">{error?.message || 'Unknown error'}</p>
      <button
        onClick={reset}
        className="mt-6 inline-flex rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}

