"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  Heart,
  Home,
  LayoutDashboard,
  Package,
  Percent,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  Tags,
  User,
  Users,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const userLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

const adminLinks = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Products", href: "/dashboard/admin/products", icon: Package },
  { label: "Categories", href: "/dashboard/admin/categories", icon: Tags },
  { label: "Orders", href: "/dashboard/admin/orders", icon: ClipboardList },
  { label: "Coupons", href: "/dashboard/admin/coupons", icon: Percent },
  { label: "Sliders", href: "/dashboard/admin/sliders", icon: SlidersHorizontal },
  { label: "Users", href: "/dashboard/admin/users", icon: Users },
  { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
  { label: "Profile", href: "/dashboard/admin/profile", icon: User },
];

const managerLinks = [
  { label: "Overview", href: "/dashboard/manager", icon: LayoutDashboard },
  { label: "Orders", href: "/dashboard/manager/orders", icon: ClipboardList },
  { label: "Products", href: "/dashboard/manager/products", icon: Boxes },
  { label: "Customers", href: "/dashboard/manager/customers", icon: Users },
  { label: "Profile", href: "/dashboard/manager/profile", icon: User },
];

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "manager"
        ? managerLinks
        : userLinks;

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-72 border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950 lg:sticky lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <ShoppingBag className="h-5 w-5" />
            </div>

            <span className="text-xl font-black text-slate-950 dark:text-white">
              ShopWise
            </span>
          </Link>

          <button
            type="button"
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-900"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(100vh-4rem)] flex-col justify-between p-4">
          <nav className="space-y-2">
            <Link
              href="/"
              prefetch={false}
              className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-800 dark:text-slate-300"
            >
              <Home className="h-4 w-4" />
              Back to Website
            </Link>

            {links.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/dashboard" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition",
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-300 dark:hover:bg-slate-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
                <User className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-950 dark:text-white">
                  {user?.name || "User"}
                </p>
                <p className="truncate text-xs capitalize text-slate-500">
                  {user?.role || "user"}
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/profile"
              prefetch={false}
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-emerald-600 hover:text-white dark:bg-slate-900 dark:text-slate-300"
            >
              <Settings className="h-3.5 w-3.5" />
              Account Settings
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}