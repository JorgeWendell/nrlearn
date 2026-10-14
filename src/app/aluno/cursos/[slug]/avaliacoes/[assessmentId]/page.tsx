import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { AssessmentForm } from "@/components/assessment-form";
import { db } from "@/db";
import { assessments, attempts, courses, enrollments, options, questions } from "@/db/schema";
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
    redirect(`/cursos/${slug}`);
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

  const showGabarito =
    assessment.type === "QUIZ"
      ? myAttempts.length > 0
      : myAttempts.length >= 2;

  return (
    <main className="page max-w-3xl">
      <Link href={`/aluno/cursos/${slug}`} className="text-sm font-semibold text-ember">
        ← Voltar ao curso
      </Link>
      <h1 className="display mt-4 text-3xl md:text-4xl">{assessment.title}</h1>
      <div className="mt-6">
        <AssessmentForm
          assessmentId={assessment.id}
          type={assessment.type}
          questions={questionsWithOptions}
          attemptsUsed={myAttempts.length}
          lastScore={myAttempts.at(-1)?.score ?? null}
          showGabarito={showGabarito}
        />
      </div>
    </main>
  );
}
