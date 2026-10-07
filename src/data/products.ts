import productsData from './products.json';

export const products = productsData;

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number | null;
  image: string;
  images: string[];
  description: string;
  material: string;
  weight: string;
  isBestSeller: boolean;
  isNew: boolean;
  rating: number;
  reviews: number;
};
