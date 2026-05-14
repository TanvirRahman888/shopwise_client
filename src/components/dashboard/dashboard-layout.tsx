"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { useAuthStore } from "@/store/auth-store";

interface DashboardLayoutProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function DashboardLayout({
  children,
  allowedRoles,
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsCheckingAuth(false);
    }, 200);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isCheckingAuth) return;

    if (!isAuthenticated || !user) {
      const shouldRedirectHome =
        sessionStorage.getItem("shopwise_logout_redirect") === "true";

      if (shouldRedirectHome) {
        sessionStorage.removeItem("shopwise_logout_redirect");
        router.replace("/");
        return;
      }

      router.replace("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      if (user.role === "admin") {
        router.replace("/dashboard/admin");
        return;
      }

      if (user.role === "manager") {
        router.replace("/dashboard/manager");
        return;
      }

      router.replace("/dashboard");
    }
  }, [allowedRoles, isAuthenticated, isCheckingAuth, router, user, pathname]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600 dark:border-slate-800 dark:border-t-emerald-500" />
          <p className="mt-4 text-sm font-bold text-slate-600 dark:text-slate-300">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex min-h-screen">
        <DashboardSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="min-w-0 flex-1">
          <DashboardTopbar onMenuClick={() => setIsSidebarOpen(true)} />

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
