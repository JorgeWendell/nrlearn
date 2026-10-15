import { Suspense } from "react";
import { DocenteSidebar } from "@/components/docente-sidebar";
import { PanelTopbar } from "@/components/panel-topbar";
import { requireProfessor } from "@/lib/session";

export default function DocentePanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-white/50">Carregando área docente…</p>}>
      <DocenteFrame>{children}</DocenteFrame>
    </Suspense>
  );
}

async function DocenteFrame({ children }: { children: React.ReactNode }) {
  const professor = await requireProfessor();

  return (
    <div className="aluno-app flex min-h-full flex-col md:flex-row">
      <DocenteSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <PanelTopbar
          name={professor.name ?? "Professor"}
          email={professor.email ?? ""}
          roleLabel="Docente"
        />
        <div className="flex-1 px-5 py-6 md:px-8 md:py-8">{children}</div>
      </div>
    </div>
  );
}
