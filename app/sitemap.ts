import type { MetadataRoute } from "next";
import { fetchCategoriesServer, fetchProductsListServer } from "@/lib/api/escuelajs";
import { SITE_URL } from "@/data/costants";

const LOCALES = ["en", "ar"] as const;
const STATIC_PATHS = [
  "",
  "/about",
  "/products",
  "/cart",
  "/support",
  "/auth/signin",
  "/auth/register",
] as const;

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, "");
}

function toAbsolute(baseUrl: string, path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

async function getProductsForSitemap() {
  try {
    const products = await fetchProductsListServer({
      offset: 0,
      limit: 250,
      title: "",
      categorySlug: "all",
      price_min: "",
      price_max: "",
    });

    return products.filter((product) => Boolean(product?.slug || product?.id));
  } catch {
    return [];
  }
}

async function getCategoriesForSitemap() {
  try {
    const categories = await fetchCategoriesServer();
    return categories.filter((category) => Boolean(category?.slug));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = normalizeBaseUrl(SITE_URL);
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((lang) =>
    STATIC_PATHS.map((path) => ({
      url: toAbsolute(baseUrl, `/${lang}${path}`),
      lastModified: now,
      changeFrequency: path === "" ? "daily" : "weekly",
      priority: path === "" ? 1 : 0.7,
    })),
  );

  const products = await getProductsForSitemap();
  const categories = await getCategoriesForSitemap();
  const productEntries: MetadataRoute.Sitemap = products.flatMap((product) => {
    const slug = product.slug || String(product.id);
    return LOCALES.map((lang) => ({
      url: toAbsolute(baseUrl, `/${lang}/products/${slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  });

  const categoryEntries: MetadataRoute.Sitemap = categories.flatMap((category) =>
    LOCALES.map((lang) => ({
      url: toAbsolute(baseUrl, `/${lang}/products?categorySlug=${encodeURIComponent(category.slug || "")}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
  );

  return [...staticEntries, ...productEntries, ...categoryEntries];
}
