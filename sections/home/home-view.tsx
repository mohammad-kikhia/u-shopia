"use client";

import Hero from "@/components/layout/Hero";
import { useTranslation } from "@/components/layout/DictionaryProvider";
import Link from "next/link";
import { ImagesSrc } from "@/data/files";
import Iconify from "@/components/shared/Iconify";

export default function HomeView() {
  const t = useTranslation();
  const statsCards = [
    {
      icon: "mdi:cash-multiple",
      iconClassName: "text-red-500",
      title: t("home:money_title"),
      subtitle: t("home:money_subtitle"),
    },
    {
      icon: "mdi:headset",
      iconClassName: "text-green-500",
      title: t("home:support_title"),
      subtitle: t("common:support_subtitle"),
    },
    {
      icon: "mdi:truck-delivery",
      iconClassName: "text-yellow-500",
      title: t("home:ship_title"),
      subtitle: t("home:ship_subtitle"),
    },
    {
      icon: "mdi:credit-card-outline",
      iconClassName: "text-blue-500",
      title: t("home:payment_title"),
      subtitle: t("home:payment_subtitle"),
    },
  ];

  return (
    <>
      <Hero
        title={t("common:brand")}
        subtitle={t("home:brand_subtitle")}
        img={ImagesSrc.landing}
      />
      <section id="home" className="w-full py-6 md:py-10">
        {/* -------------------- main paragraph -------------------- */}
        <div
          className="about-home mx-auto my-2 w-full max-w-7xl px-6 lg:my-5"
          data-aos="fade-up"
          data-aos-duration="550"
          data-aos-easing="ease-out-cubic"
        >
          <h1 className="mb-1 text-3xl font-bold md:text-4xl">
            {t("common:brand")}
          </h1>
          <h3 className="text-xl font-semibold text-accent md:text-2xl">
            {t("home:brand_subtitle2")}
          </h3>
          <p className="mt-3 max-w-3xl text-base leading-7 md:text-lg">
            {t("home:lorem40")}
          </p>
          <Link
            href="/products"
            className="mt-5 inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition hover:brightness-110"
          >
            {t("home:shop_now")}
          </Link>
        </div>
        {/* -------------------- stats -------------------- */}
        <div className="stats-home mx-auto my-2 w-full max-w-7xl px-6 lg:my-5">
          <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((card, i) => (
              <div
                key={card.icon}
                className="rounded-2xl border border-slate-200/60 p-4 dark:border-slate-800"
                data-aos="fade-up"
                data-aos-duration="500"
                data-aos-delay={Math.min(i * 70, 280)}
                data-aos-easing="ease-out-cubic"
              >
                <div className="p-2 flex flex-col items-center justify-center">
                  <Iconify
                    icon={card.icon}
                    width={40}
                    height={40}
                    className={`my-4 ${card.iconClassName}`}
                  />
                  <h4 className="text-xl font-extrabold">{card.title}</h4>
                  <p>{card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
