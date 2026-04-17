import { getDictionary } from "./app/[lang]/dictionaries";

interface HomeProps {
  params: {
    locale: string;
  };
}

type Trans = Awaited<ReturnType<typeof getDictionary>>;
