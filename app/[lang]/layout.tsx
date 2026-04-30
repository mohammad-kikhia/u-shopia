import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/poppins/latin-700.css";
import "@fontsource/tajawal/arabic-400.css";
import "@fontsource/tajawal/arabic-500.css";
import "@fontsource/tajawal/arabic-700.css";
import "@fontsource/pacifico/latin-400.css";
import Providers from "./providers";
import { getDictionary, hasLocale } from "./dictionaries";
import { FALLBACK_SITE_URL, SITE_ORIGIN } from "@/data/costants";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/header/Navbar";
import { rtlLanguages } from "@/data/variables";
import "../globals.css";
import "aos/dist/aos.css";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ar" }];
}

export async function generateMetadata({
  params,
  modal: _modal,
}: {
  params: Promise<{ lang: string }>;
  /** Parallel route slot; unused here but required to match layout props in Next.js 16. */
  modal: ReactNode;
}): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  const metaData = {
    title: dictionary?.common?.metadata?.title,
    description: dictionary?.common?.metadata?.description,
    author: dictionary?.common?.metadata?.author,
    siteName: dictionary?.common?.metadata?.siteName,
    siteUrl: FALLBACK_SITE_URL,
    keywords: [
      "uShopia",
      "online store",
      "متجر إلكتروني",
      "ecommerce",
      "تجارة إلكترونية",
      "electronics",
      "إلكترونيات",
      "goods",
      "منتجات",
      "fashion",
      "أزياء",
    ],
  };

  const siteUrl = SITE_ORIGIN || metaData.siteUrl.replace(/\/$/, "");
  const canonicalPath = `/${lang}`;

  return {
    metadataBase: new URL(siteUrl),
    // Child routes must set `title` to the page name only (no site suffix); template adds localized site name.
    title: {
      template: `%s | ${metaData.title}`,
      default: dictionary.home.title,
    },
    description: metaData.description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: `${siteUrl}/en`,
        ar: `${siteUrl}/ar`,
        "x-default": `${siteUrl}/en`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    applicationName: metaData.siteName,
    keywords: metaData.keywords,
    authors: [
      { name: metaData.author },
      { name: metaData.author, url: siteUrl },
    ],
    category: "ecommerce",
    publisher: metaData.author,
    creator: metaData.author,
    openGraph: {
      title: `${dictionary.home.title} | ${metaData.title}`,
      description: metaData.description,
      siteName: metaData.siteName,
      url: `${siteUrl}${canonicalPath}`,
      type: "website",
      locale: lang === "ar" ? "ar_SA" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${dictionary.home.title} | ${metaData.title}`,
      description: metaData.description,
    },
  };
}

export default async function RootLayout({
  children,
  params,
  modal,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dictionary = await getDictionary(lang);

  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const theme: "light" | "dark" =
    themeCookie === "dark" || themeCookie === "light" ? themeCookie : "light";

  return (
    <html
      className={`overflow-x-hidden ${theme === "dark" ? "dark" : ""}`}
      lang={lang}
      dir={rtlLanguages.includes(lang) ? "rtl" : "ltr"}
      data-scroll-behavior="smooth"
      data-theme={theme}
    >
      <body className="overflow-hidden">
        <Providers dictionary={dictionary}>
          <Navbar lang={lang} t={dictionary} />
          <main className="pt-17">
            {children}
            <ScrollToTopButton t={dictionary} />
          </main>
          {modal}
        </Providers>
        <Footer lang={lang} t={dictionary} />
      </body>
    </html>
  );
}
