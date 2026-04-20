"use client";

import Link from "next/link";
import Iconify from "@/components/shared/Iconify";
import { DirectionalIcon } from "@/components/shared/DirectionalIcon";
import {
  contactMethods,
  footerPages,
  githubLink,
  socials,
} from "@/data/variables";
import { Locale } from "@/app/[lang]/dictionaries";
import type { Trans } from "@/types";

const Footer = ({ lang, t }: { lang: Locale; t: Trans }) => {
  const currentYear = new Date().getFullYear();
  const f = t.footer;

  return (
    <footer
      id="footer"
      className="relative mt-4 overflow-hidden border-t border-slate-200/70 bg-linear-to-b from-slate-50/95 via-background to-slate-100/40 dark:border-slate-800/80 dark:from-slate-950 dark:via-background dark:to-slate-950/90"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/45 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-s-32 top-24 h-72 w-72 rounded-full bg-accent/[0.07] blur-3xl dark:bg-accent/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -inset-e-24 bottom-0 h-56 w-56 rounded-full bg-slate-400/10 blur-3xl dark:bg-slate-600/15"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-10 pt-12 md:pb-12 md:pt-14">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div
            className="lg:col-span-5"
            data-aos="fade-up"
            data-aos-duration="520"
            data-aos-easing="ease-out-cubic"
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              <span
                className="h-1.5 w-1.5 rounded-full bg-accent shadow-sm shadow-accent/50"
                aria-hidden
              />
              {t.common.brand}
            </p>
            <h2 className="mt-5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {t.common.brand}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted md:text-base">
              {f.subtext}
            </p>
            <Link
              href={`/${lang}/products`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:gap-3"
            >
              <DirectionalIcon
                icon="tabler:arrow-right"
                width={18}
                aria-hidden
              />
              {t.common.shop}
            </Link>
          </div>

          <div
            className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-2"
            data-aos="fade-up"
            data-aos-duration="520"
            data-aos-delay="60"
            data-aos-easing="ease-out-cubic"
          >
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                {f.links}
              </h3>
              <ul className="mt-5 space-y-1">
                {footerPages.map((page) => {
                  const localizedHref =
                    page.href === "/" ? `/${lang}` : `/${lang}${page.href}`;
                  const label = t.common[
                    page.labelKey as keyof typeof t.common
                  ] as string;
                  return (
                    <li key={page.href}>
                      <Link
                        href={localizedHref}
                        className="group flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 text-sm font-medium text-foreground/90 transition hover:bg-slate-100/90 dark:hover:bg-slate-800/80"
                      >
                        <span>{label}</span>
                        <DirectionalIcon
                          icon="tabler:chevron-right"
                          width={18}
                          className="text-muted opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 rtl:group-hover:-translate-x-0.5"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                  {f.social}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.title}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      title={s.title}
                      aria-label={s.title}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/80 bg-background text-foreground/80 shadow-sm transition hover:border-accent/40 hover:bg-accent/5 hover:text-accent dark:border-slate-700/80"
                    >
                      <Iconify icon={s.icon} width={20} aria-hidden />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                  {f.contact_methods}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-muted">
                  {contactMethods.map((cm) => {
                    const label = f[cm.name as "phone" | "email" | "location"];
                    const inner = (
                      <span className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200/60 text-foreground/70 dark:bg-slate-800/80">
                          <Iconify icon={cm.icon} width={16} aria-hidden />
                        </span>
                        <span
                          className="pt-1 leading-snug"
                          dir={
                            ["phone", "email"].includes(cm.name)
                              ? "ltr"
                              : undefined
                          }
                        >
                          {cm.title}
                        </span>
                      </span>
                    );
                    return (
                      <li key={cm.name}>
                        {"href" in cm && cm.href ? (
                          <a
                            href={cm.href}
                            className="block transition hover:text-accent"
                          >
                            {inner}
                          </a>
                        ) : (
                          <span className="block">{inner}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-12 flex flex-col items-stretch gap-6 border-t border-slate-200/70 pt-8 dark:border-slate-800/90 md:flex-row md:items-center md:justify-between"
          data-aos="fade-up"
          data-aos-duration="480"
          data-aos-delay="80"
          data-aos-easing="ease-out-cubic"
        >
          <div className="space-y-2 text-center text-xs text-muted md:text-start">
            <p>
              <span>
                {currentYear} {f.copyright}{" "}
              </span>
              <a
                target="_blank"
                rel="noreferrer"
                href={githubLink}
                className="font-medium text-accent underline-offset-2 hover:underline"
              >
                {t.common.metadata.author}
              </a>
              <span>{f.rights}</span>
            </p>
            {/* <p className="text-[11px] text-muted/80">
              {f.signature.made_with} · {f.signature.by} {f.signature.name}
            </p> */}
          </div>
          {/* <Link
            href="#home"
            className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-slate-300/90 px-4 py-2 text-xs font-semibold text-foreground/90 transition hover:border-accent/50 hover:bg-accent/5 hover:text-accent dark:border-slate-600 md:self-auto"
          >
            <Iconify icon="tabler:arrow-up" width={16} aria-hidden />
            {f.back_to_top}
          </Link> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
