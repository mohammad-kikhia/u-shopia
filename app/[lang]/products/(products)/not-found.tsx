import Link from "next/link";

export default function ProductsNotFound() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-14 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-3 text-muted">The products page is unavailable right now.</p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white"
      >
        Back Home
      </Link>
    </section>
  );
}

