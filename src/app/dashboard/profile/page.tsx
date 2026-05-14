import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function ProfilePage() {
  return (
    <DashboardLayout allowedRoles={["user", "admin", "manager"]}>
      <h1 className="text-3xl font-black text-slate-950 dark:text-white">
        Profile
      </h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Editable profile information will be added in a later step.
      </p>
    </DashboardLayout>
  );
}