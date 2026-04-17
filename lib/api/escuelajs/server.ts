import { EscuelaApiPaths } from "@/data/api/endpoints";
import { normalizeProductDetail, normalizeProductListItem } from "./normalize";
import { buildProductsListSearchParams, type ProductsListFilterInput } from "./query";
import type { EscuelaCategoryRaw, EscuelaProductDetailRaw, EscuelaProductRaw, ProductDetail, ProductListItem } from "./types";

const REVALIDATE_PRODUCTS = 300;
const REVALIDATE_CATEGORIES = 900;

type NextFetchInit = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

export async function fetchProductsListServer(
  input: ProductsListFilterInput,
  init?: NextFetchInit,
): Promise<ProductListItem[]> {
  const query = buildProductsListSearchParams(input);
  const url = `${EscuelaApiPaths.products}?${query.toString()}`;
  const response = await fetch(url, {
    ...init,
    next: { revalidate: REVALIDATE_PRODUCTS, tags: ["products"], ...init?.next },
  });
  if (!response.ok) throw new Error("Products fetch failed");
  const data = (await response.json()) as EscuelaProductRaw[] | undefined;
  return (data ?? []).map(normalizeProductListItem);
}

export async function fetchCategoriesServer(init?: NextFetchInit): Promise<EscuelaCategoryRaw[]> {
  const response = await fetch(EscuelaApiPaths.categories, {
    ...init,
    next: { revalidate: REVALIDATE_CATEGORIES, tags: ["categories"], ...init?.next },
  });
  if (!response.ok) throw new Error("Categories fetch failed");
  return ((await response.json()) as EscuelaCategoryRaw[]) ?? [];
}

export async function fetchProductsAndCategoriesServer(input: ProductsListFilterInput): Promise<{
  products: ProductListItem[];
  categories: EscuelaCategoryRaw[];
}> {
  const query = buildProductsListSearchParams(input);
  const [productsResponse, categoriesResponse] = await Promise.all([
    fetch(`${EscuelaApiPaths.products}?${query.toString()}`, {
      next: { revalidate: REVALIDATE_PRODUCTS, tags: ["products"] },
    }),
    fetch(EscuelaApiPaths.categories, {
      next: { revalidate: REVALIDATE_CATEGORIES, tags: ["categories"] },
    }),
  ]);

  if (!productsResponse.ok || !categoriesResponse.ok) {
    throw new Error("Products or categories fetch failed");
  }

  const productsRaw = ((await productsResponse.json()) as EscuelaProductRaw[]) ?? [];
  const categories = ((await categoriesResponse.json()) as EscuelaCategoryRaw[]) ?? [];

  return {
    products: productsRaw.map(normalizeProductListItem),
    categories,
  };
}

export async function fetchProductBySlugServer(productSlug: string): Promise<ProductDetail | null> {
  try {
    const response = await fetch(EscuelaApiPaths.productBySlug(productSlug), {
      next: { revalidate: REVALIDATE_PRODUCTS, tags: [`product-${productSlug}`] },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as EscuelaProductDetailRaw;
    return normalizeProductDetail(data);
  } catch {
    return null;
  }
}

export async function fetchRelatedBySlugServer(productSlug: string): Promise<ProductListItem[]> {
  try {
    const res = await fetch(EscuelaApiPaths.relatedBySlug(productSlug), {
      next: { revalidate: REVALIDATE_PRODUCTS, tags: [`product-related-${productSlug}`] },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as EscuelaProductRaw[] | undefined;
    const list = Array.isArray(data) ? data : [];
    return list.slice(0, 9).map(normalizeProductListItem);
  } catch {
    return [];
  }
}
