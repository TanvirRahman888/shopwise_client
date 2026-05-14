"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  Sparkles,
  User,
  UserCircle,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth-store";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Deals", href: "/deals" },
  { label: "Assistant", href: "/assistant" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const dashboardHref =
    user?.role === "admin"
      ? "/dashboard/admin"
      : user?.role === "manager"
        ? "/dashboard/manager"
        : "/dashboard";

  const handleLogout = () => {
    sessionStorage.setItem("shopwise_logout_redirect", "true");
    logout();
    setIsProfileOpen(false);
    setIsOpen(false);
    router.replace("/");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
              <ShoppingCart className="h-5 w-5" />
            </div>

            <span className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
              ShopWise
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className="relative text-sm font-semibold text-slate-600 transition hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
              >
                {link.label}

                {link.label === "Assistant" && (
                  <Badge className="absolute -right-8 -top-3 h-4 rounded-full bg-violet-600 px-1.5 text-[10px]">
                    New
                  </Badge>
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
            <div className="relative hidden w-full max-w-xs xl:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search products..."
                className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-500"
              />
            </div>

            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
            >
              <Heart className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                2
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                3
              </span>
            </Button>

            {!isAuthenticated ? (
              <Button
                asChild
                className="rounded-full bg-emerald-600 px-5 font-semibold hover:bg-emerald-700"
              >
                <Link href="/login" prefetch={false}>
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            ) : (
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-2 pr-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                    {user?.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="h-5 w-5" />
                    )}
                  </div>

                  <span className="max-w-24 truncate">{user?.name}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-200 p-4 dark:border-slate-800">
                      <p className="font-black text-slate-950 dark:text-white">
                        {user?.name}
                      </p>
                      <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                        {user?.email}
                      </p>
                      <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold capitalize text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {user?.role}
                      </span>
                    </div>

                    <div className="p-2">
                      <ProfileMenuLink
                        href={dashboardHref}
                        icon={<LayoutDashboard className="h-4 w-4" />}
                        label="Dashboard"
                        onClick={() => setIsProfileOpen(false)}
                      />

                      <ProfileMenuLink
                        href="/dashboard/profile"
                        icon={<User className="h-4 w-4" />}
                        label="Profile"
                        onClick={() => setIsProfileOpen(false)}
                      />

                      <ProfileMenuLink
                        href="/dashboard/orders"
                        icon={<ShoppingCart className="h-4 w-4" />}
                        label="Orders"
                        onClick={() => setIsProfileOpen(false)}
                      />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-bold text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 lg:hidden dark:border-slate-800 dark:text-slate-200"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="border-t border-slate-200 py-4 lg:hidden dark:border-slate-800">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search products..."
                  className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <nav className="grid gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  <span>{link.label}</span>
                  {link.label === "Assistant" && (
                    <Sparkles className="h-4 w-4 text-violet-500" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="mt-4 flex items-center gap-3">
              <ThemeToggle />

              <Button variant="outline" className="flex-1 rounded-full">
                Wishlist
              </Button>

              {!isAuthenticated ? (
                <Button
                  asChild
                  className="flex-1 rounded-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <Link
                    href="/login"
                    prefetch={false}
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="flex-1 rounded-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <Link
                    href={dashboardHref}
                    prefetch={false}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                </Button>
              )}
            </div>

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-bold text-rose-600 dark:border-rose-900"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </div>
        )}
      </Container>
    </header>
  );
}

function ProfileMenuLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {icon}
      {label}
    </Link>
  );
}
