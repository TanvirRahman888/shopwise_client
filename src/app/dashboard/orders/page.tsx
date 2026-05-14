import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function OrdersPage() {
  return (
    <DashboardLayout allowedRoles={["user"]}>
      <h1 className="text-3xl font-black text-slate-950 dark:text-white">
        My Orders
      </h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Order history will be added after checkout is complete.
      </p>
    </DashboardLayout>
  );
}