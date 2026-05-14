import { ClipboardList, Package, Users, UserCheck } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";

export default function ManagerDashboardPage() {
  return (
    <DashboardLayout allowedRoles={["manager"]}>
      <div className="space-y-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
            Manager Dashboard
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Operations Overview
          </h2>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage assigned orders, stock updates, products, and customers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard
            title="Assigned Orders"
            value="0"
            description="Orders assigned to you"
            icon={ClipboardList}
          />

          <DashboardStatCard
            title="Products"
            value="21+"
            description="Products available"
            icon={Package}
          />

          <DashboardStatCard
            title="Customers"
            value="0"
            description="Customers in your queue"
            icon={Users}
          />

          <DashboardStatCard
            title="Status"
            value="Active"
            description="Manager account ready"
            icon={UserCheck}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}