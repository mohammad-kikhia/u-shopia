import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDictionary } from "../dictionaries";
import { getRefreshCookieName } from "@/lib/auth/constants";
import CartView from "@/sections/cart/cart-view";
import "../../styles/globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.cart_page.title,
  };
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const cookieStore = await cookies();
  const hasRefreshSession = Boolean(
    cookieStore.get(getRefreshCookieName())?.value,
  );
  if (!hasRefreshSession) {
    const returnTo = `/${lang}/cart`;
    redirect(
      `/${lang}/auth/signin?returnTo=${encodeURIComponent(returnTo)}`,
    );
  }
  const dictionary = await getDictionary(lang);
  return <CartView lang={lang} t={dictionary} />;
}
