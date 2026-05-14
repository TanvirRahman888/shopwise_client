import { useQuery } from "@tanstack/react-query";
import { getActiveSliders } from "@/lib/api/sliders";

export function useActiveSliders() {
  return useQuery({
    queryKey: ["active-sliders"],
    queryFn: getActiveSliders,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: "always",
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}