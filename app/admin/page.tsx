// app/admin/page.tsx
import AdminDashboard from "@/components/admin/AdminDashboard";

// (opsional) paksa selalu fresh saat build dev
export const dynamic = "force-dynamic";

export default function Page() {
  return <AdminDashboard />;
}
