import type { ProductListItem } from "@/lib/api/escuelajs";
import { toAbsoluteUrl } from "@/lib/seo/absolute-url";

type Props = {
  products: ProductListItem[];
  lang: string;
  siteOrigin: string;
  query?: string;
};

/** Collection + ItemList structured data for product listing/search pages. */
export default function ProductListJsonLd({ products, lang, siteOrigin, query = "" }: Props) {
  const basePath = `/${lang}/products`;
  const trimmedQuery = query.trim();
  const listingUrl = trimmedQuery
    ? toAbsoluteUrl(siteOrigin, `${basePath}?q=${encodeURIComponent(trimmedQuery)}`)
    : toAbsoluteUrl(siteOrigin, basePath);

  const itemListElement = products.slice(0, 24).map((product, index) => {
    const slug = product.slug || String(product.id);
    const productUrl = toAbsoluteUrl(siteOrigin, `/${lang}/products/${slug}`);
    const image = product.image || product.images?.[0];

    return {
      "@type": "ListItem",
      position: index + 1,
      url: productUrl,
      item: {
        "@type": "Product",
        name: product.title || `Product ${product.id}`,
        image: image ? toAbsoluteUrl(siteOrigin, image) : undefined,
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: Number.isFinite(product.price) ? String(product.price) : "0",
          availability: "https://schema.org/InStock",
          url: productUrl,
        },
      },
    };
  });

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: trimmedQuery ? `Products matching "${trimmedQuery}"` : "Products",
        url: listingUrl,
        inLanguage: lang,
      },
      {
        "@type": "ItemList",
        name: trimmedQuery ? `Search results for ${trimmedQuery}` : "Product listing",
        url: listingUrl,
        numberOfItems: itemListElement.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
