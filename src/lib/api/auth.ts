import { api } from "@/lib/api/axios";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";

export async function loginUser(payload: LoginPayload) {
  const res = await api.post<AuthResponse>("/auth/login", payload);
  return res.data;
}

export async function registerUser(payload: RegisterPayload) {
  const res = await api.post<AuthResponse>("/auth/register", payload);
  return res.data;
}