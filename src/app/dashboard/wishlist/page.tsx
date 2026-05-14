import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function WishlistPage() {
  return (
    <DashboardLayout allowedRoles={["user"]}>
      <h1 className="text-3xl font-black text-slate-950 dark:text-white">
        Wishlist
      </h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Wishlist products will be added in a later step.
      </p>
    </DashboardLayout>
  );
}