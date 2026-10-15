import { notFound, redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { AssessmentForm } from "@/components/assessment-form";
import { db } from "@/db";
import { assessments, attempts, courses, enrollments, options, questions } from "@/db/schema";
import { getProvaAttemptState } from "@/lib/prova-attempts";
import { requireAluno } from "@/lib/session";

export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ slug: string; assessmentId: string }>;
}) {
  const user = await requireAluno();
  const { slug, assessmentId } = await params;
  const [course] = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  if (!course) notFound();

  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, user.id), eq(enrollments.courseId, course.id)))
    .limit(1);
  if (!enrollment || (enrollment.status !== "ATIVA" && enrollment.status !== "CONCLUIDA")) {
    redirect(`/aluno/cursos/${slug}`);
  }

  const [assessment] = await db
    .select()
    .from(assessments)
    .where(eq(assessments.id, assessmentId))
    .limit(1);
  if (!assessment || assessment.courseId !== course.id) notFound();

  const qs = await db
    .select()
    .from(questions)
    .where(eq(questions.assessmentId, assessment.id))
    .orderBy(asc(questions.order));

  const questionsWithOptions = await Promise.all(
    qs.map(async (q) => ({
      ...q,
      options: await db.select().from(options).where(eq(options.questionId, q.id)),
    })),
  );

  const myAttempts = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.userId, user.id), eq(attempts.assessmentId, assessment.id)));

  const orderedAttempts = [...myAttempts].sort(
    (a, b) => new Date(a.finishedAt).getTime() - new Date(b.finishedAt).getTime(),
  );
  const prova = assessment.type === "PROVA" ? getProvaAttemptState(orderedAttempts) : null;
  const showGabarito = assessment.type === "QUIZ" ? orderedAttempts.length > 0 : (prova?.showGabarito ?? false);

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col p-6 md:p-10">
      <h1 className="mb-6 text-2xl font-semibold">{assessment.title}</h1>
      <AssessmentForm
        assessmentId={assessment.id}
        type={assessment.type}
        questions={questionsWithOptions}
        attemptsUsed={orderedAttempts.length}
        lastScore={orderedAttempts.at(-1)?.score ?? null}
        showGabarito={showGabarito}
        canTry={assessment.type === "QUIZ" ? true : (prova?.canTry ?? false)}
        windowLabel={prova?.windowLabel}
        unlockAt={prova?.unlockAt?.toISOString() ?? null}
      />
    </div>
  );
}
