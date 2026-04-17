import { EscuelaApiPaths } from "@/data/api/endpoints";

export type ProductsListFilterInput = {
  title?: string;
  categorySlug?: string;
  price_min?: string;
  price_max?: string;
  offset?: string | number;
  limit?: string | number;
};

/** Query string for `GET /products` (list + filters). */
export function buildProductsListSearchParams(input: ProductsListFilterInput): URLSearchParams {
  const params = new URLSearchParams();
  const offset = input.offset ?? "0";
  const limit = input.limit ?? "12";
  params.set("offset", String(offset));
  params.set("limit", String(limit));
  if (input.title) params.set("title", input.title);
  if (input.price_min) params.set("price_min", input.price_min);
  if (input.price_max) params.set("price_max", input.price_max);
  if (input.categorySlug && input.categorySlug !== "all") {
    params.set("categorySlug", input.categorySlug);
  }
  return params;
}

export function getProductsListUrl(input: ProductsListFilterInput): string {
  const q = buildProductsListSearchParams(input);
  return `${EscuelaApiPaths.products}?${q.toString()}`;
}
