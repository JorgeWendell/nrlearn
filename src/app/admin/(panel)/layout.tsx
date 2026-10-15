import { Suspense } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { requireAdmin } from "@/lib/session";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-muted">Carregando painel…</p>}>
      <AdminFrame>{children}</AdminFrame>
    </Suspense>
  );
}

async function AdminFrame({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-full flex-col bg-[#efe8dc] md:flex-row">
      <AdminSidebar adminName={admin.name ?? "Administrador"} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
