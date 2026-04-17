'use client';

import Hero from "@/components/layout/Hero";
import { useTranslation } from "@/components/layout/DictionaryProvider";
import { ImagesSrc } from "@/data/files";
import Iconify from "@/components/shared/Iconify";

export default function SupportView() {
  const t = useTranslation();

  return (
    <>
      <Hero
        title={t("support:customer_title")}
        subtitle={t("support:support_subtitle")}
        img={ImagesSrc.support}
      />
      <section className="mx-auto w-full max-w-7xl px-6 py-8 md:py-12">
        <h1
          className="mb-6 text-center text-3xl font-bold md:text-4xl"
          data-aos="fade-up"
          data-aos-duration="550"
          data-aos-easing="ease-out-cubic"
        >
          {t("support:contact_us")}
        </h1>
        <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-background shadow-sm dark:border-slate-800 md:grid md:grid-cols-12">
          <aside
            className="bg-accent p-6 text-white md:col-span-4 lg:col-span-3"
            data-aos="fade-up"
            data-aos-duration="520"
            data-aos-easing="ease-out-cubic"
          >
            <div className="flex h-full flex-col justify-center text-center md:text-start">
              <Iconify icon="fa:envelope-open" className="mx-auto mb-4 text-6xl md:mx-0" />
              <h2 className="mb-3 text-2xl font-bold">{t("support:contact_us")}</h2>
              <p className="text-sm/6 text-white/90">{t("support:contact_us_sub")}</p>
            </div>
          </aside>

          <div
            className="p-6 md:col-span-8 lg:col-span-9"
            data-aos="fade-up"
            data-aos-duration="520"
            data-aos-delay="100"
            data-aos-easing="ease-out-cubic"
          >
            <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t("support:first_name")}</span>
                <input
                  type="text"
                  required
                  placeholder={t("support:enter_first_name")}
                  className="h-11 w-full rounded-lg border border-slate-300/70 bg-background px-3 text-sm outline-none transition focus:border-accent dark:border-slate-700"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t("support:last_name")}</span>
                <input
                  type="text"
                  required
                  placeholder={t("support:enter_last_name")}
                  className="h-11 w-full rounded-lg border border-slate-300/70 bg-background px-3 text-sm outline-none transition focus:border-accent dark:border-slate-700"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-1 block text-sm font-medium">{t("support:email")}</span>
                <input
                  type="email"
                  required
                  placeholder={t("support:enter_email")}
                  className="h-11 w-full rounded-lg border border-slate-300/70 bg-background px-3 text-sm outline-none transition focus:border-accent dark:border-slate-700"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-1 block text-sm font-medium">{t("support:comment")}</span>
                <textarea
                  rows={5}
                  placeholder={t("support:enter_comment")}
                  className="w-full rounded-lg border border-slate-300/70 bg-background px-3 py-2 text-sm outline-none transition focus:border-accent dark:border-slate-700"
                />
              </label>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  {t("support:submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
