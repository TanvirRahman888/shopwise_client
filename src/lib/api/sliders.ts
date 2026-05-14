import { api } from "@/lib/api/axios";
import { SlidersResponse } from "@/types/slider";

export async function getActiveSliders() {
  const res = await api.get<SlidersResponse>("/sliders/active");

  return res.data;
}