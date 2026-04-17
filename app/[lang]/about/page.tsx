import { getDictionary } from "../dictionaries";
import AboutView from "@/sections/about/about-view";
import "../../styles/globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.common.about_us,
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;

  return (
    <>
      <section
        id="about"
        className="relative overflow-hidden"
      >
        <AboutView />
      </section>
    </>
  );
}
