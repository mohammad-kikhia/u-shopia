import { getDictionary } from "./dictionaries";
import HomeView from "@/sections/home/home-view";
import "../styles/globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.home.title,
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <section
        id="home"
        className="relative overflow-hidden"
      >
        <HomeView />
      </section>
    </>
  );
}
