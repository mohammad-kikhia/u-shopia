import Link from "next/link";

type Category = {
  id?: number;
  name?: string;
  slug?: string;
};

type ProductsFiltersFormProps = {
  lang: string;
  t: {
    common?: { search_placeholder?: string };
    products?: Record<string, string>;
  };
  categories: Category[];
  filters: {
    title: string;
    categorySlug: string;
    price_min: string;
    price_max: string;
    sorted: string;
  };
  limit: number;
  className?: string;
};

export default function ProductsFiltersForm({
  lang,
  t,
  categories,
  filters,
  limit,
  className,
}: ProductsFiltersFormProps) {
  const p = t.products ?? {};

  return (
    <form
      action={`/${lang}/products`}
      method="get"
      className={className ?? "grid grid-cols-1 gap-3"}
    >
      <label>
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
          {p.search}
        </span>
        <input
          name="title"
          defaultValue={filters.title}
          placeholder={t.common?.search_placeholder}
          className="h-10 w-full rounded-lg border border-slate-300/70 bg-background px-3 text-sm outline-none transition focus:border-accent dark:border-slate-700"
        />
      </label>

      <label>
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
          {p.category}
        </span>
        <select
          name="categorySlug"
          defaultValue={filters.categorySlug}
          className="h-10 w-full rounded-lg border border-slate-300/70 bg-background px-3 text-sm outline-none transition focus:border-accent dark:border-slate-700"
        >
          <option value="all">{p.all_categories}</option>
          {categories.map((category) => (
            <option key={category?.id || category?.slug} value={category?.slug || "all"}>
              {category?.name || category?.slug || p.unknown_category}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            {p.price_min}
          </span>
          <input
            name="price_min"
            type="number"
            min="0"
            defaultValue={filters.price_min}
            placeholder="0"
            className="h-10 w-full rounded-lg border border-slate-300/70 bg-background px-3 text-sm outline-none transition focus:border-accent dark:border-slate-700"
          />
        </label>
        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            {p.price_max}
          </span>
          <input
            name="price_max"
            type="number"
            min="0"
            defaultValue={filters.price_max}
            placeholder="9999"
            className="h-10 w-full rounded-lg border border-slate-300/70 bg-background px-3 text-sm outline-none transition focus:border-accent dark:border-slate-700"
          />
        </label>
      </div>

      <input type="hidden" name="offset" value="0" />
      <input type="hidden" name="limit" value={limit} />
      {filters.sorted ? <input type="hidden" name="sorted" value={filters.sorted} /> : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="submit"
          className="inline-flex flex-1 items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 sm:flex-none"
        >
          {p.apply_filters}
        </button>
        <Link
          href={`/${lang}/products`}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent dark:border-slate-700 sm:flex-none"
        >
          {p.reset_filters}
        </Link>
      </div>
    </form>
  );
}
