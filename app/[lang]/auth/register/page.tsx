import { getDictionary } from "../../dictionaries";
import RegisterView from "@/sections/auth/register-view";
import "../../../styles/globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.auth.signup_title,
    robots: { index: false, follow: false },
  };
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <RegisterView lang={lang} t={dictionary} />;
}
