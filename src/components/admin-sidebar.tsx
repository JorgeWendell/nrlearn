"use client";

import { PanelSidebar } from "@/components/panel-sidebar";

export function AdminSidebar({ adminName }: { adminName: string }) {
  return (
    <PanelSidebar
      kicker="NRLearn"
      title="Painel"
      userName={adminName}
      dashboardHref="/admin"
      groups={[
        {
          label: "Cadastros",
          items: [
            { href: "/admin/cadastros/professores", label: "Professor" },
            { href: "/admin/cadastros/admins", label: "Admin" },
          ],
        },
      ]}
    />
  );
}
