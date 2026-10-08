import productsData from './products.json';

export const products = productsData;

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  original_price?: number | null;
  image: string;
  images: string[];
  description: string;
  material: string;
  weight: string;
  isBestSeller?: boolean;
  is_best_seller?: boolean;
  isNew?: boolean;
  is_new?: boolean;
  rating: number;
  reviews: number;
};
