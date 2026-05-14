"use client";

import { create } from "zustand";
import { AuthUser } from "@/types/auth";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
  loadAuthFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    localStorage.setItem("shopwise_token", token);
    localStorage.setItem("shopwise_user", JSON.stringify(user));

    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("shopwise_token");
    localStorage.removeItem("shopwise_user");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  loadAuthFromStorage: () => {
    const token = localStorage.getItem("shopwise_token");
    const userRaw = localStorage.getItem("shopwise_user");

    if (!token || !userRaw) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
      return;
    }

    try {
      const user = JSON.parse(userRaw) as AuthUser;

      set({
        user,
        token,
        isAuthenticated: true,
      });
    } catch {
      localStorage.removeItem("shopwise_token");
      localStorage.removeItem("shopwise_user");

      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },
}));