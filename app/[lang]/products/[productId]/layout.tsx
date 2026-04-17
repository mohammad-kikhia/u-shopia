import { ReactNode } from "react";

export default function ProductDetailsLayout({
  children,
  related: relatedProducts,
}: {
  children: ReactNode;
  related: ReactNode;
}) {
  return (
    <>
      {children}
      {relatedProducts}
    </>
  );
}

