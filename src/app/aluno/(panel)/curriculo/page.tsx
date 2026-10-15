import { AlunoPageHeader } from "@/components/aluno-page-header";
import { CurriculoProfile } from "@/components/curriculo-profile";
import { getStudentProfile } from "@/lib/actions/profile";
import { requireAluno } from "@/lib/session";

export default async function CurriculoPage() {
  const user = await requireAluno();
  const profile = await getStudentProfile(user.id);

  return (
    <div>
      <AlunoPageHeader
        crumbs={["Início", "Currículo"]}
        title="Currículo"
        subtitle="Gerencie seu perfil profissional e destaque suas conquistas e habilidades."
        icon={
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M7 3h7l5 5v13H7V3Z" />
            <path d="M14 3v5h5M9 13h6M9 17h4" />
          </svg>
        }
      />
      <CurriculoProfile name={user.name ?? "Aluno"} profile={profile} />
    </div>
  );
}
