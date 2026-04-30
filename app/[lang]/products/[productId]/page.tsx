import type { Metadata } from "next";
import { getDictionary } from "../../dictionaries";
import ProductDetailsView from "@/sections/products/product-details-view";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import { SITE_ORIGIN } from "@/data/costants";
import "../../../styles/globals.css";
import { notFound } from "next/navigation";
import { fetchProductBySlugServer } from "@/lib/api/escuelajs";
import { stripHtmlToPlainText } from "@/lib/seo/plain-text";
import { toAbsoluteUrl } from "@/lib/seo/absolute-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; productId: string }>;
}): Promise<Metadata> {
  const { lang, productId } = await params;
  const [dictionary, product] = await Promise.all([
    getDictionary(lang),
    fetchProductBySlugServer(productId),
  ]);
  const productsT = (dictionary as { products?: Record<string, string> }).products ?? {};
  const meta = dictionary.common.metadata;
  const siteOrigin = SITE_ORIGIN;
  const suffix = meta.title;
  const siteName = meta.siteName;

  if (!product?.id) {
    return {
      title: productsT.untitled_product || "Product",
      description: dictionary.common.metadata.description,
      robots: { index: false, follow: false },
    };
  }

  const slug = product.slug || String(product.id);
  const metaTitle = product.title || productsT.untitled_product || "Product";
  const rawDescription =
    product.description || productsT.no_description || dictionary.common.metadata.description;
  const plainDescription = stripHtmlToPlainText(rawDescription, 320);
  const canonicalPath = `/${lang}/products/${productId}`;
  const canonicalUrl = toAbsoluteUrl(siteOrigin, canonicalPath);
  const imageSources = (product.images?.length ? product.images : [product.image]).filter(Boolean);
  const ogImages = imageSources.slice(0, 6).map((url, i) => ({
    url: toAbsoluteUrl(siteOrigin, url),
    width: 1200,
    height: 1200,
    alt: i === 0 ? metaTitle : `${metaTitle} (${i + 1})`,
  }));

  const keywords = [
    metaTitle,
    product.category,
    siteName,
    lang === "ar" ? "تسوق" : "shop",
    lang === "ar" ? "شراء أونلاين" : "buy online",
  ].filter(Boolean);

  const ogTitle = `${metaTitle} | ${suffix}`;

  return {
    title: metaTitle,
    description: plainDescription,
    keywords,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: toAbsoluteUrl(siteOrigin, `/en/products/${slug}`),
        ar: toAbsoluteUrl(siteOrigin, `/ar/products/${slug}`),
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: ogTitle,
      description: plainDescription,
      url: canonicalUrl,
      siteName,
      type: "website",
      images: ogImages,
      locale: lang === "ar" ? "ar_SA" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: plainDescription,
      images: ogImages[0]?.url ? [ogImages[0].url] : undefined,
    },
    category: product.category,
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ lang: string; productId: string }>;
}) {
  const { lang, productId } = await params;
  const [dictionary, product] = await Promise.all([
    getDictionary(lang),
    fetchProductBySlugServer(productId),
  ]);

  if (!product || !product?.id) {
    notFound();
  }

  const siteOrigin = SITE_ORIGIN;

  return (
    <>
      <ProductJsonLd
        product={product}
        lang={lang}
        siteOrigin={siteOrigin}
        siteName={dictionary.common.metadata.siteName}
        schemaBrandName={dictionary.common.metadata.title}
      />
      <ProductDetailsView lang={lang} t={dictionary} product={product} />
    </>
  );
}
