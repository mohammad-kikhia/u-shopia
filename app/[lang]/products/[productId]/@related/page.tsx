import RelatedCarousel from "@/sections/products/RelatedCarousel";
import { getDictionary } from "../../../dictionaries";
import { fetchRelatedBySlugServer } from "@/lib/api/escuelajs";

export default async function RelatedProducts({
  params,
}: {
  params: Promise<{ lang: string; productId: string }>;
}) {
  const { lang, productId } = await params;
  const [t, related] = await Promise.all([
    getDictionary(lang),
    fetchRelatedBySlugServer(productId),
  ]);
  if (!related?.length) return null;
  return <RelatedCarousel lang={lang} t={t} products={related} />;
}
