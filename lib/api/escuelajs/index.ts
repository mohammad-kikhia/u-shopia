/**
 * Escuela JS API — types, URL builders, normalization, and server fetch helpers.
 * Endpoints live in `@/data/api/endpoints`.
 */

export type {
  EscuelaCategoryRaw,
  EscuelaProductDetailRaw,
  EscuelaProductRaw,
  ProductDetail,
  ProductListItem,
} from "./types";

export { normalizeProductDetail, normalizeProductListItem } from "./normalize";
export { buildProductsListSearchParams, getProductsListUrl, type ProductsListFilterInput } from "./query";
export {
  fetchCategoriesServer,
  fetchProductBySlugServer,
  fetchProductsAndCategoriesServer,
  fetchProductsListServer,
  fetchRelatedBySlugServer,
} from "./server";
