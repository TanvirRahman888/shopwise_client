"use client";

import { Menu, Search, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

interface DashboardTopbarProps {
  onMenuClick: () => void;
}

export function DashboardTopbar({ onMenuClick }: DashboardTopbarProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    sessionStorage.setItem("shopwise_logout_redirect", "true");
    logout();
    router.replace("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 lg:hidden dark:border-slate-800 dark:text-slate-200"
            aria-label="Open dashboard sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
              Dashboard
            </p>
            <h1 className="text-lg font-black text-slate-950 dark:text-white">
              Welcome, {user?.name || "User"}
            </h1>
          </div>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search dashboard..."
              className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-2 dark:border-slate-800 sm:flex">
            <UserCircle className="h-5 w-5 text-emerald-600" />
            <div className="max-w-32">
              <p className="truncate text-xs font-bold text-slate-950 dark:text-white">
                {user?.name || "User"}
              </p>
              <p className="truncate text-[11px] capitalize text-slate-500">
                {user?.role || "user"}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            className="rounded-full"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
