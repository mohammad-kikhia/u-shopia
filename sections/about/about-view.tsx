"use client";

import Image from "next/image";
import Hero from "@/components/layout/Hero";
import { useTranslation } from "@/components/layout/DictionaryProvider";
import Link from "next/link";
import { ImagesSrc } from "@/data/files";
import Iconify from "@/components/shared/Iconify";
import { DirectionalIcon } from "@/components/shared/DirectionalIcon";

export default function AboutView() {
  const t = useTranslation();
  const teamMembers = [
    { name: t("about:team_member_1"), img: ImagesSrc.team1 },
    { name: t("about:team_member_2"), img: ImagesSrc.team2 },
    { name: t("about:team_member_3"), img: ImagesSrc.team3 },
    { name: t("about:team_member_4"), img: ImagesSrc.team4 },
  ];

  const aboutServices = [
    { icon: "mdi:lightbulb-on-outline", title: t("about:special_title_1") },
    { icon: "mdi:shopping-search-outline", title: t("about:special_title_2") },
    { icon: "mdi:truck-fast-outline", title: t("about:special_title_3") },
  ];

  return (
    <>
      <Hero
        title={t("about:about_title")}
        subtitle={t("about:about_sub")}
        img={ImagesSrc.about}
      />
      <section className="mx-auto w-full max-w-7xl px-6 py-8 md:py-12">
        <div
          className="mb-8 text-center"
          data-aos="fade-up"
          data-aos-duration="550"
          data-aos-easing="ease-out-cubic"
        >
          <h2 className="text-2xl font-bold md:text-3xl">
            {t("about:our_team")}
          </h2>
        </div>
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, i) => (
            <li key={member.name}>
              <article
                className="h-full rounded-2xl border border-slate-200/60 bg-background p-5 text-center shadow-sm transition hover:shadow-md dark:border-slate-800"
                data-aos="fade-up"
                data-aos-duration="500"
                data-aos-delay={Math.min(i * 75, 300)}
                data-aos-easing="ease-out-cubic"
              >
                <Image
                  src={member.img}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
                />
                <h3 className="text-lg font-bold">{member.name}</h3>
                <p className="mt-1 text-sm text-muted">
                  {t("about:freelancer")}
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="text-accent transition hover:scale-110"
                  >
                    <Iconify icon="fa:facebook" />
                  </a>
                  <a
                    href="#"
                    aria-label="Twitter"
                    className="text-accent transition hover:scale-110"
                  >
                    <Iconify icon="fa:twitter" />
                  </a>
                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="text-accent transition hover:scale-110"
                  >
                    <Iconify icon="fa:linkedin" />
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-10 md:pb-14">
        <h2
          className="text-center text-2xl font-bold text-accent md:text-3xl"
          data-aos="fade-up"
          data-aos-duration="550"
          data-aos-easing="ease-out-cubic"
        >
          {t("about:what_we_do")}
        </h2>
        <p
          className="mx-auto mt-2 max-w-3xl text-center text-muted"
          data-aos="fade-up"
          data-aos-duration="500"
          data-aos-delay="60"
          data-aos-easing="ease-out-cubic"
        >
          {t("about:what_we_do_subtext")}
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {aboutServices.map((service, i) => (
            <article
              key={service.title}
              className="rounded-2xl border border-slate-200/60 bg-background p-5 shadow-sm dark:border-slate-800"
              data-aos="fade-up"
              data-aos-duration="500"
              data-aos-delay={Math.min(120 + i * 80, 360)}
              data-aos-easing="ease-out-cubic"
            >
              <div className="mb-3">
                <Iconify
                  icon={service.icon}
                  className="text-accent"
                  width={40}
                  height={40}
                />
              </div>
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm text-muted">
                {t("about:what_we_do_subtext")}
              </p>
              <Link
                href="/about"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
              >
                {t("about:read_more")}
                <DirectionalIcon icon="fa6-solid:arrow-right-long" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
