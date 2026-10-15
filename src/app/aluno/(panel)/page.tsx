import { AlunoPageHeader } from "@/components/aluno-page-header";
import { requireAluno } from "@/lib/session";

export default async function AlunoDashboardPage() {
  await requireAluno();

  return (
    <div>
      <AlunoPageHeader
        crumbs={["Início", "Dashboard"]}
        title="Dashboard"
        subtitle="Veja o seu progresso e estatísticas"
      />
      <p className="text-sm text-white/55">Em breve mais conteúdos serão adicionados aqui...</p>
    </div>
  );
}
