/** Raw shapes returned by Escuela JS (may be partial). */

export type EscuelaProductRaw = {
  id?: number;
  slug?: string;
  title?: string;
  price?: number;
  description?: string;
  category?: string | { name?: string };
  image?: string;
  images?: string[];
};

export type EscuelaCategoryRaw = {
  id?: number;
  name?: string;
  slug?: string;
  image?: string;
};

export type EscuelaProductDetailRaw = {
  id?: number;
  slug?: string;
  title?: string;
  description?: string;
  category?: string | { name?: string };
  image?: string;
  images?: string[];
  price?: number;
};

/** Normalized product for grid / cards / infinite scroll. */
export type ProductListItem = {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category?: string | { name?: string };
  images?: string[];
};

/** Normalized product for the PDP. */
export type ProductDetail = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number;
  images: string[];
};
