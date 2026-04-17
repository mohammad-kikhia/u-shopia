import Image from "next/image";

const Hero = ({ title, subtitle, img }) => {
  return (
    <section className="relative mb-2 w-full overflow-hidden bg-linear-to-br from-slate-100 via-slate-50 to-slate-200 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 md:py-12">
      <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-8 md:grid-cols-3">
          <div
            className="rounded-2xl bg-black/35 p-5 text-white shadow-xl backdrop-blur-sm md:col-span-1 md:bg-transparent md:p-0 md:text-inherit md:shadow-none md:backdrop-blur-none"
            data-aos="fade-up"
            data-aos-duration="550"
            data-aos-easing="ease-out-cubic"
          >
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">{title}</h1>
            <h3 className="text-base md:text-lg">{subtitle}</h3>
          </div>
          <div
            className="md:col-span-2"
            data-aos="fade-up"
            data-aos-duration="550"
            data-aos-delay="100"
            data-aos-easing="ease-out-cubic"
          >
            <Image
              priority
              className="mx-auto h-auto w-full max-w-4xl object-contain lg:h-[460px] lg:w-auto"
              src={img}
              width={1200}
              height={900}
              alt="Hero image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
