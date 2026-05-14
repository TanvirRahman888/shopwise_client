import { Heart, ShoppingBag, Ticket, User } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";

export default function UserDashboardPage() {
  return (
    <DashboardLayout allowedRoles={["user"]}>
      <div className="space-y-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
            User Dashboard
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Account Overview
          </h2>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Track your orders, wishlist, coupons, and profile details.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard
            title="Total Orders"
            value="0"
            description="Orders placed from your account"
            icon={ShoppingBag}
          />

          <DashboardStatCard
            title="Wishlist"
            value="0"
            description="Saved products"
            icon={Heart}
          />

          <DashboardStatCard
            title="Coupons Used"
            value="0"
            description="Discounts applied"
            icon={Ticket}
          />

          <DashboardStatCard
            title="Profile"
            value="Active"
            description="Your account is ready"
            icon={User}
          />
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-black text-slate-950 dark:text-white">
            Recent Activity
          </h3>

          <p className="mt-3 text-slate-600 dark:text-slate-400">
            You have no recent activity yet. Start shopping to see your order
            history here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}