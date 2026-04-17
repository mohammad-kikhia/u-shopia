import { getDictionary } from "../../dictionaries";
import ProductsView from "@/sections/products/products-view";
import "../../../styles/globals.css";
import { notFound } from "next/navigation";
import { fetchProductsAndCategoriesServer } from "@/lib/api/escuelajs";
import type { EscuelaCategoryRaw, ProductListItem } from "@/lib/api/escuelajs";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ lang }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const dictionary = await getDictionary(lang);
  const productsT = (dictionary as { products?: Record<string, string> }).products ?? {};
  const titleFilter =
    typeof resolvedSearchParams.title === "string" ? resolvedSearchParams.title : "";
  const categorySlug =
    typeof resolvedSearchParams.categorySlug === "string"
      ? resolvedSearchParams.categorySlug
      : "all";
  const priceMin =
    typeof resolvedSearchParams.price_min === "string" ? resolvedSearchParams.price_min : "0";
  const priceMax =
    typeof resolvedSearchParams.price_max === "string"
      ? resolvedSearchParams.price_max
      : (productsT.seo_any_price ?? "any");
  const hasTitle = !!titleFilter.trim();
  const hasCat = Boolean(categorySlug && categorySlug !== "all");
  const hasPrice =
    (typeof resolvedSearchParams.price_min === "string" &&
      resolvedSearchParams.price_min.trim() !== "") ||
    (typeof resolvedSearchParams.price_max === "string" &&
      resolvedSearchParams.price_max.trim() !== "");
  const hasFilters = hasTitle || hasCat || hasPrice;

  const baseListingTitle = productsT.products_sup1 || "Products";

  const titleParts: string[] = [];
  if (hasTitle) titleParts.push(titleFilter.trim());
  if (hasCat) titleParts.push(categorySlug);
  if (hasPrice) {
    titleParts.push(
      `${productsT.seo_products_between ?? "products"} ${priceMin} ${productsT.seo_and ?? "and"} ${priceMax}`,
    );
  }
  const title = titleParts.length > 0 ? titleParts.join(" · ") : baseListingTitle;

  const description = productsT.products_sup2 ?? dictionary.common.metadata.description;

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/products`,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ lang }, dictionary, resolvedSearchParams] = await Promise.all([
    params,
    params.then(({ lang }) => getDictionary(lang)),
    searchParams,
  ]);

  const query = {
    title: typeof resolvedSearchParams.title === "string" ? resolvedSearchParams.title : "",
    categorySlug:
      typeof resolvedSearchParams.categorySlug === "string"
        ? resolvedSearchParams.categorySlug
        : "all",
    price_min:
      typeof resolvedSearchParams.price_min === "string" ? resolvedSearchParams.price_min : "",
    price_max:
      typeof resolvedSearchParams.price_max === "string" ? resolvedSearchParams.price_max : "",
    offset: typeof resolvedSearchParams.offset === "string" ? resolvedSearchParams.offset : "0",
    limit: typeof resolvedSearchParams.limit === "string" ? resolvedSearchParams.limit : "12",
    sorted:
      typeof resolvedSearchParams.sorted === "string" ? resolvedSearchParams.sorted : "",
  };

  let products: ProductListItem[] = [];
  let categories: EscuelaCategoryRaw[] = [];
  try {
    const result = await fetchProductsAndCategoriesServer(query);
    products = result.products;
    categories = result.categories;
  } catch {
    products = [];
    categories = [];
  }

  if (!products && !categories) {
    notFound();
  }

  if (query.sorted === "nameAsc") {
    products.sort((a, b) => (a?.title || "").localeCompare(b?.title || ""));
  } else if (query.sorted === "nameDesc") {
    products.sort((a, b) => (b?.title || "").localeCompare(a?.title || ""));
  } else if (query.sorted === "priceAsc") {
    products.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
  } else if (query.sorted === "priceDesc") {
    products.sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0));
  }

  return (
    <ProductsView
      lang={lang}
      t={dictionary}
      products={products}
      categories={categories}
      filters={query}
    />
  );
}
