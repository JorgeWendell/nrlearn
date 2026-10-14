import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { asc, eq } from "drizzle-orm";
import { DocenteShell } from "@/components/docente-shell";
import { AssessmentEditorForm } from "@/components/teacher-forms";
import { db } from "@/db";
import { assessments, courses } from "@/db/schema";
import { requireProfessor } from "@/lib/session";

export default function DocenteAssessmentsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-muted">Carregando avaliações…</p>}>
      <DocenteAssessments params={params} />
    </Suspense>
  );
}

async function DocenteAssessments({ params }: { params: Promise<{ id: string }> }) {
  await requireProfessor();
  const { id } = await params;
  const [course] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  if (!course) notFound();

  const list = await db
    .select()
    .from(assessments)
    .where(eq(assessments.courseId, id))
    .orderBy(asc(assessments.order));

  return (
    <DocenteShell kicker="Cursos" title={`Avaliações — ${course.title}`}>
      <Link href={`/docente/cursos/${id}`} className="text-sm font-semibold text-ember">
        ← Voltar ao curso
      </Link>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <section className="card p-6">
          <h2 className="font-serif text-2xl">Nova prova ou quiz</h2>
          <div className="mt-6">
            <AssessmentEditorForm courseId={id} />
          </div>
        </section>
        <section className="card p-6">
          <h2 className="font-serif text-2xl">Existentes</h2>
          <ul className="mt-4 space-y-3">
            {list.length === 0 ? (
              <li className="text-sm text-muted">Nenhuma avaliação ainda.</li>
            ) : (
              list.map((item) => (
                <li key={item.id} className="border-b border-navy/10 pb-3">
                  <Link
                    href={`/docente/cursos/${id}/avaliacoes/${item.id}`}
                    className="font-medium hover:text-ember"
                  >
                    {item.type === "PROVA" ? "Prova" : "Quiz"} — {item.title}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </DocenteShell>
  );
}
