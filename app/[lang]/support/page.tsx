import { getDictionary } from "../dictionaries";
import SupportView from "@/sections/support/support-view";
import "../../styles/globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.common.customer_service,
  };
}

export default async function SupportPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;

  return (
    <>
      <section
        id="support"
        className="relative overflow-hidden"
      >
        <SupportView />
      </section>
    </>
  );
}
