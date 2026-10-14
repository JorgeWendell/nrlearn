import { DocenteShell } from "@/components/docente-shell";
import { CourseEditorForm } from "@/components/teacher-forms";
import { requireProfessor } from "@/lib/session";

export default async function NovoCursoPage() {
  await requireProfessor();

  return (
    <DocenteShell kicker="Cursos" title="Novo">
      <section className="card max-w-xl p-6">
        <p className="text-sm text-muted">
          Depois você adiciona videoaulas, provas e vê os alunos matriculados.
        </p>
        <div className="mt-6">
          <CourseEditorForm />
        </div>
      </section>
    </DocenteShell>
  );
}
