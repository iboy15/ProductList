// src/types/product.ts
export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    category?: string; // Optional field
  }