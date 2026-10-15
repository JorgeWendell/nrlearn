import { Suspense } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { PanelTopbar } from "@/components/panel-topbar";
import { requireAdmin } from "@/lib/session";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-white/50">Carregando painel…</p>}>
      <AdminFrame>{children}</AdminFrame>
    </Suspense>
  );
}

async function AdminFrame({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="aluno-app flex min-h-full flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <PanelTopbar
          name={admin.name ?? "Administrador"}
          email={admin.email ?? ""}
          roleLabel="Admin"
        />
        <div className="flex-1 px-5 py-6 md:px-8 md:py-8">{children}</div>
      </div>
    </div>
  );
}
