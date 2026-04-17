import { ReactNode } from "react";

/** Layout for the products listing route only: full-width shell; filters UI lives in `ProductsView`. */
export default function ProductsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="relative min-h-[50vh] overflow-x-hidden">
      {children}
    </section>
  );
}

