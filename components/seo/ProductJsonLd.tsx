import type { ProductDetail } from '@/lib/api/escuelajs';
import { stripHtmlToPlainText } from '@/lib/seo/plain-text';
import { toAbsoluteUrl } from '@/lib/seo/absolute-url';

type Props = {
  product: ProductDetail;
  lang: string;
  siteOrigin: string;
  /** Legal / short site name (e.g. OG site_name). */
  siteName: string;
  /** Localized consumer-facing brand (schema.org Brand / Organization). */
  schemaBrandName: string;
  currency?: string;
};

/** Product structured data for rich results (safe: values are JSON-stringified). */
export default function ProductJsonLd({
  product,
  lang,
  siteOrigin,
  siteName,
  schemaBrandName,
  currency = 'USD',
}: Props) {
  const canonicalPath = `/${lang}/products/${product.slug || product.id}`;
  const pageUrl = toAbsoluteUrl(siteOrigin, canonicalPath);
  const images = (product.images?.length ? product.images : [product.image]).map((src) =>
    toAbsoluteUrl(siteOrigin, src),
  );
  const description = stripHtmlToPlainText(product.description || '', 5000);

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description,
    image: images,
    sku: String(product.id),
    url: pageUrl,
    brand: {
      '@type': 'Brand',
      name: schemaBrandName,
    },
    offers: {
      '@type': 'Offer',
      url: pageUrl,
      priceCurrency: currency,
      price: Number.isFinite(product.price) ? String(product.price) : '0',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: siteName,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify escapes <, >, etc. in product copy
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
