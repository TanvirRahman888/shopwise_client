import {
  ClipboardList,
  Package,
  Percent,
  SlidersHorizontal,
  Users,
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <div className="space-y-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
            Admin Dashboard
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Store Management Overview
          </h2>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage products, orders, coupons, sliders, users, and analytics.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          <DashboardStatCard
            title="Products"
            value="21+"
            description="Products in store"
            icon={Package}
          />

          <DashboardStatCard
            title="Orders"
            value="0"
            description="Total order records"
            icon={ClipboardList}
          />

          <DashboardStatCard
            title="Coupons"
            value="0"
            description="Active discounts"
            icon={Percent}
          />

          <DashboardStatCard
            title="Sliders"
            value="3+"
            description="Homepage banners"
            icon={SlidersHorizontal}
          />

          <DashboardStatCard
            title="Users"
            value="1+"
            description="Registered users"
            icon={Users}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xl font-black text-slate-950 dark:text-white">
              Admin Tasks
            </h3>

            <ul className="mt-5 space-y-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
              <li>Manage product upload with variants and images.</li>
              <li>Create and update dynamic hero sliders.</li>
              <li>Manage coupon rules and usage limits.</li>
              <li>Track orders and customer activity.</li>
            </ul>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xl font-black text-slate-950 dark:text-white">
              Next Admin Features
            </h3>

            <p className="mt-3 text-slate-600 dark:text-slate-400">
              We will connect these cards to real backend analytics after the
              order, cart, coupon, and admin CRUD modules are complete.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}