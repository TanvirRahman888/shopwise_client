"use client";

import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export function AuthProvider({ children }: { children: ReactNode }) {
  const loadAuthFromStorage = useAuthStore((state) => state.loadAuthFromStorage);

  useEffect(() => {
    loadAuthFromStorage();
  }, [loadAuthFromStorage]);

  return <>{children}</>;
}