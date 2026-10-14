"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { assessments, attempts, courses, enrollments, options, questions } from "@/db/schema";
import { requireAluno } from "@/lib/session";

const PROVA_MAX = 2;

export async function submitAssessment(assessmentId: string, formData: FormData) {
  const user = await requireAluno();

  const [assessment] = await db
    .select()
    .from(assessments)
    .where(eq(assessments.id, assessmentId))
    .limit(1);
  if (!assessment) return { error: "Avaliação não encontrada." };

  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, user.id), eq(enrollments.courseId, assessment.courseId)))
    .limit(1);
  if (!enrollment || (enrollment.status !== "ATIVA" && enrollment.status !== "CONCLUIDA")) {
    return { error: "Matrícula não liberada." };
  }

  const previous = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.userId, user.id), eq(attempts.assessmentId, assessmentId)));

  if (assessment.type === "PROVA" && previous.length >= PROVA_MAX) {
    return { error: "Você já usou as 2 tentativas desta prova." };
  }

  const qs = await db
    .select()
    .from(questions)
    .where(eq(questions.assessmentId, assessmentId));

  const answerMap: Record<string, string> = {};
  let correct = 0;

  for (const q of qs) {
    const chosen = String(formData.get(`q-${q.id}`) ?? "");
    answerMap[q.id] = chosen;
    const opts = await db.select().from(options).where(eq(options.questionId, q.id));
    const right = opts.find((o) => o.isCorrect);
    if (right && chosen === right.id) correct += 1;
  }

  const score = qs.length === 0 ? 0 : Math.round((correct / qs.length) * 100);

  await db.insert(attempts).values({
    userId: user.id,
    assessmentId,
    attemptNumber: previous.length + 1,
    score,
    answers: JSON.stringify(answerMap),
  });

  const [course] = await db.select().from(courses).where(eq(courses.id, assessment.courseId)).limit(1);
  revalidatePath(`/aluno/cursos/${course?.slug}/avaliacoes/${assessmentId}`);
  return { ok: true, score };
}
