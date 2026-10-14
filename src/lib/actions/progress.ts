"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { courses, enrollments, lessonProgress, lessons } from "@/db/schema";
import { requireAluno } from "@/lib/session";
import { maybeCompleteEnrollment } from "@/lib/progress";

export async function markLessonComplete(lessonId: string) {
  const user = await requireAluno();

  const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
  if (!lesson) return { error: "Aula não encontrada." };

  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, user.id), eq(enrollments.courseId, lesson.courseId)))
    .limit(1);

  if (!enrollment || (enrollment.status !== "ATIVA" && enrollment.status !== "CONCLUIDA")) {
    return { error: "Matrícula não liberada." };
  }

  const [already] = await db
    .select()
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, user.id), eq(lessonProgress.lessonId, lessonId)))
    .limit(1);

  if (!already) {
    await db.insert(lessonProgress).values({
      userId: user.id,
      lessonId,
    });
  }

  await maybeCompleteEnrollment(user.id, lesson.courseId);

  const [course] = await db.select().from(courses).where(eq(courses.id, lesson.courseId)).limit(1);
  revalidatePath(`/aluno/cursos/${course?.slug}`);
  revalidatePath(`/aluno/cursos/${course?.slug}/aulas/${lessonId}`);
  return { ok: true };
}
