import { Suspense } from "react";
import { getDictionary } from "../../dictionaries";
import SignInView from "@/sections/auth/signin-view";
import "../../../styles/globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.auth.signin_title,
    robots: { index: false, follow: false },
  };
}

export default async function SignInPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-lg px-6 py-16 text-center text-sm text-muted">
          {dictionary.auth.loading}
        </div>
      }
    >
      <SignInView lang={lang} t={dictionary} />
    </Suspense>
  );
}
