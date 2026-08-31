export type Role = "artisan" | "buyer";

export interface Artisan {
  id: string;
  slug: string;
  name: string;
  craft: string;
  location: string;
  experience: number;
  tagline: string;
  story: string;
  languages: string[];
  rating: number;
  initials: string;
}

export type ProductStatus = "published" | "draft";

export interface Product {
  id: string;
  artisanId: string;
  title: string;
  titleHi: string;
  description: string;
  story: string;
  category: string;
  subcategory: string;
  tags: string[];
  price: number;
  image: string;
  rating: number;
  reviews: number;
  views: number;
  sold: number;
  craft: string;
  material: string;
  createdAt: string;
  status: ProductStatus;
}

export type OrderStatus = "Pending" | "Confirmed" | "Packed" | "Shipped" | "Delivered";

export const ORDER_FLOW: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
];

export interface Order {
  id: string;
  productId: string;
  buyerName: string;
  city: string;
  qty: number;
  amount: number;
  status: OrderStatus;
  placedAt: string;
}

export interface Message {
  id: string;
  productId: string;
  from: "buyer" | "artisan";
  text: string;
  translated?: string;
}

export interface PriceBreakdown {
  material: number;
  labour: number;
  complexity: number;
  market: number;
  margin: number;
}

export interface SessionUser {
  role: Role;
  name: string;
  email: string;
  artisanId?: string;
}
