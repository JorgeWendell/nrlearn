import { Suspense } from "react";
import { DocenteSidebar } from "@/components/docente-sidebar";
import { requireProfessor } from "@/lib/session";

export default function DocentePanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-muted">Carregando área docente…</p>}>
      <DocenteFrame>{children}</DocenteFrame>
    </Suspense>
  );
}

async function DocenteFrame({ children }: { children: React.ReactNode }) {
  const professor = await requireProfessor();

  return (
    <div className="flex min-h-full flex-col bg-[#efe8dc] md:flex-row">
      <DocenteSidebar professorName={professor.name ?? "Professor"} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
