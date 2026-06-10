export type CartProductSnapshot = {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  shortDescription: string;
};
