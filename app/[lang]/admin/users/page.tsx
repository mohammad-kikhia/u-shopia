import { getDictionary } from "../../dictionaries";
import AdminUsersView from "@/sections/admin/admin-users-view";
import "../../../styles/globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.admin.users_title,
    robots: { index: false, follow: false },
  };
}

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const dictionary = await getDictionary((await params).lang);
  return <AdminUsersView t={dictionary} />;
}
