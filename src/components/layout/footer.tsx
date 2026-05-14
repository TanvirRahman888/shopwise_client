import Link from "next/link";
import { Mail, MapPin, Phone, ShoppingCart } from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Deals", href: "/deals" },
  { label: "Assistant", href: "/assistant" },
  { label: "Blog", href: "/blog" },
];

const customerLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Track Order", href: "/track-order" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy Policy", href: "/privacy" },
];

const accountLinks = [
  { label: "Login / Register", href: "/login" },
  { label: "My Orders", href: "/dashboard/orders" },
  { label: "Wishlist", href: "/dashboard/wishlist" },
  { label: "Cart", href: "/cart" },
  { label: "Account Settings", href: "/dashboard/profile" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_1fr_1fr_1.3fr]">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <ShoppingCart className="h-5 w-5" />
              </div>

              <span className="text-xl font-black text-slate-950 dark:text-white">
                ShopWise
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">
              A modern ecommerce platform with smart recommendations, flexible
              product variants, secure checkout, and exclusive coupons.
            </p>

            <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-600" />
                +880 1770-888106
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-600" />
                support@shopwise.com
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-emerald-600" />
                Dhaka, Bangladesh
              </p>
            </div>

            <div className="mt-5 flex gap-3">
              {[
                { icon: FaFacebookF, href: "#", label: "Facebook" },
                { icon: FaInstagram, href: "#", label: "Instagram" },
                { icon: FaXTwitter, href: "#", label: "X" },
                { icon: FaYoutube, href: "#", label: "YouTube" },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-emerald-600 hover:text-emerald-600 dark:border-slate-800 dark:text-slate-400 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <FooterColumn title="Quick Links" links={quickLinks} />
          <FooterColumn title="Customer Service" links={customerLinks} />
          <FooterColumn title="My Account" links={accountLinks} />

          <div>
            <h3 className="font-bold text-slate-950 dark:text-white">
              Newsletter
            </h3>

            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Subscribe to get new arrivals, smart deals, coupon updates, and
              shopping tips.
            </p>

            <div className="mt-5 flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-full"
              />
              <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700">
                Subscribe
              </Button>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-slate-950 dark:text-white">
                We Accept
              </p>
              <div className="flex flex-wrap gap-2">
                {["VISA", "PayPal", "Mastercard", "Apple Pay"].map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600 dark:border-slate-800 dark:text-slate-400"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500 dark:border-slate-800">
          © {new Date().getFullYear()} ShopWise. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-bold text-slate-950 dark:text-white">{title}</h3>

      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-slate-600 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
