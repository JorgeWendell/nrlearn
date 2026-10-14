import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { and, asc, eq, inArray } from "drizzle-orm";
import { DocenteShell } from "@/components/docente-shell";
import { QuestionEditorForm } from "@/components/teacher-forms";
import { db } from "@/db";
import { assessments, courses, options, questions } from "@/db/schema";
import { requireProfessor } from "@/lib/session";

export default function DocenteAssessmentDetailPage({
  params,
}: {
  params: Promise<{ id: string; assessmentId: string }>;
}) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-muted">Carregando questões…</p>}>
      <DocenteAssessmentDetail params={params} />
    </Suspense>
  );
}

async function DocenteAssessmentDetail({
  params,
}: {
  params: Promise<{ id: string; assessmentId: string }>;
}) {
  await requireProfessor();
  const { id, assessmentId } = await params;
  const [course] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  const [assessment] = await db
    .select()
    .from(assessments)
    .where(and(eq(assessments.id, assessmentId), eq(assessments.courseId, id)))
    .limit(1);
  if (!course || !assessment) notFound();

  const questionRows = await db
    .select()
    .from(questions)
    .where(eq(questions.assessmentId, assessmentId))
    .orderBy(asc(questions.order));

  const questionIds = questionRows.map((question) => question.id);
  const optionRows = questionIds.length
    ? await db.select().from(options).where(inArray(options.questionId, questionIds))
    : [];

  return (
    <DocenteShell kicker="Cursos" title={assessment.title}>
      <Link href={`/docente/cursos/${id}/avaliacoes`} className="text-sm font-semibold text-ember">
        ← Avaliações
      </Link>
      <p className="mt-2 text-sm text-muted">
        {assessment.type === "PROVA" ? "Prova — 2 tentativas para o aluno" : "Quiz de prática"}
      </p>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <section className="card p-6">
          <h2 className="font-serif text-2xl">Nova questão</h2>
          <div className="mt-6">
            <QuestionEditorForm courseId={id} assessmentId={assessmentId} />
          </div>
        </section>
        <section className="card p-6">
          <h2 className="font-serif text-2xl">Questões</h2>
          <ol className="mt-4 space-y-4">
            {questionRows.length === 0 ? (
              <li className="text-sm text-muted">Nenhuma questão ainda.</li>
            ) : (
              questionRows.map((question) => (
                <li key={question.id}>
                  <p className="font-medium">
                    {question.order}. {question.prompt}
                  </p>
                  <ul className="mt-1 text-sm text-muted">
                    {optionRows
                      .filter((option) => option.questionId === question.id)
                      .map((option) => (
                        <li key={option.id}>
                          {option.isCorrect ? "✓ " : ""}
                          {option.text}
                        </li>
                      ))}
                  </ul>
                </li>
              ))
            )}
          </ol>
        </section>
      </div>
    </DocenteShell>
  );
}
