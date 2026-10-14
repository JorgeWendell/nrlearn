"use client";

import { PanelSidebar } from "@/components/panel-sidebar";

export function DocenteSidebar({ professorName }: { professorName: string }) {
  return (
    <PanelSidebar
      kicker="NRLearn"
      title="Docente"
      userName={professorName}
      dashboardHref="/docente"
      groups={[
        {
          label: "Cursos",
          items: [
            { href: "/docente/cursos/novo", label: "Novo" },
            {
              href: "/docente/cursos",
              label: "Visualizar",
              isActive: (pathname) =>
                pathname === "/docente/cursos" ||
                (pathname.startsWith("/docente/cursos/") && !pathname.startsWith("/docente/cursos/novo")),
            },
          ],
        },
      ]}
    />
  );
}
