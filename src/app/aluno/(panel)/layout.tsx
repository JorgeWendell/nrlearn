import { Suspense } from "react";
import { AlunoSidebar } from "@/components/aluno-sidebar";
import { AlunoTopbar } from "@/components/aluno-topbar";
import { requireAluno } from "@/lib/session";

export default function AlunoPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-white/50">Carregando área do aluno…</p>}>
      <AlunoFrame>{children}</AlunoFrame>
    </Suspense>
  );
}

async function AlunoFrame({ children }: { children: React.ReactNode }) {
  const aluno = await requireAluno();

  return (
    <div className="aluno-app flex min-h-full flex-col md:flex-row">
      <AlunoSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AlunoTopbar name={aluno.name ?? "Aluno"} email={aluno.email ?? ""} />
        <div className="flex-1 px-5 py-6 md:px-8 md:py-8">{children}</div>
      </div>
    </div>
  );
}
