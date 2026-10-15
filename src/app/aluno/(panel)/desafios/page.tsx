import { AlunoPageHeader } from "@/components/aluno-page-header";
import { requireAluno } from "@/lib/session";

export default async function DesafiosPage() {
  await requireAluno();

  return (
    <div>
      <AlunoPageHeader crumbs={["Início", "Desafios"]} title="Desafios" subtitle="Pratique o que aprendeu" />
      <p className="text-sm text-white/55">Em breve mais conteúdos serão adicionados aqui...</p>
    </div>
  );
}
