import { useQuery } from "@tanstack/react-query";
import { getProducts, ProductQueryParams } from "@/lib/api/products";

export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: "always",
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}