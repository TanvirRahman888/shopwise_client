import { api } from "@/lib/api/axios";
import { Product, ProductsResponse } from "@/types/product";

export interface ProductQueryParams {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function getProducts(params?: ProductQueryParams) {
  const res = await api.get<ProductsResponse>("/products", {
    params,
  });

  return res.data;
}

export async function getProductById(id: string) {
  const res = await api.get<{
    success: boolean;
    product: Product;
  }>(`/products/${id}`);

  return res.data;
}