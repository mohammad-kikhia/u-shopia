import type { EscuelaProductDetailRaw, EscuelaProductRaw, ProductDetail, ProductListItem } from "./types";

const FALLBACK_IMAGE = "/icon";

export function normalizeProductListItem(product: EscuelaProductRaw | null | undefined): ProductListItem {
  return {
    ...product,
    id: Number(product?.id || 0),
    slug: product?.slug || "",
    title: product?.title || "",
    description: product?.description || "",
    price: Number(product?.price || 0),
    image: product?.image || product?.images?.[0] || FALLBACK_IMAGE,
  };
}

export function normalizeProductDetail(
  input: EscuelaProductDetailRaw | null | undefined,
): ProductDetail | null {
  if (!input) return null;
  const safeId = Number(input.id || 0);
  const safeSlug = input.slug || "";
  const safeTitle = input.title || "";
  const safeDescription = input.description || "";
  const safeCategory =
    typeof input.category === "string" ? input.category : input.category?.name || "";
  const safeImage = input.image || input.images?.[0] || FALLBACK_IMAGE;
  const safePrice = Number(input.price || 0);

  return {
    id: safeId,
    slug: safeSlug,
    title: safeTitle,
    description: safeDescription,
    category: safeCategory,
    image: safeImage,
    price: safePrice,
    images: Array.isArray(input.images) ? input.images : safeImage ? [safeImage] : [],
  };
}
