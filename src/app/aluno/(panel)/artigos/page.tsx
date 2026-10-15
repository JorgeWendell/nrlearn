import { AlunoPageHeader } from "@/components/aluno-page-header";
import { requireAluno } from "@/lib/session";

export default async function ArtigosPage() {
  await requireAluno();

  return (
    <div>
      <AlunoPageHeader crumbs={["Início", "Artigos"]} title="Artigos" subtitle="Materiais de estudo" />
      <p className="text-sm text-white/55">Em breve mais conteúdos serão adicionados aqui...</p>
    </div>
  );
}
