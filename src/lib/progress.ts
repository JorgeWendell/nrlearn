import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { enrollments, lessonProgress, lessons } from "@/db/schema";

export async function maybeCompleteEnrollment(userId: string, courseId: string) {
  const courseLessons = await db.select().from(lessons).where(eq(lessons.courseId, courseId));
  if (courseLessons.length === 0) return;

  const progress = await db
    .select()
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, userId));

  const done = new Set(progress.map((p) => p.lessonId));
  const allDone = courseLessons.every((l) => done.has(l.id));
  if (!allDone) return;

  await db
    .update(enrollments)
    .set({ status: "CONCLUIDA" })
    .where(
      and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId),
        eq(enrollments.status, "ATIVA"),
      ),
    );
}

export { isLessonUnlocked } from "@/lib/lesson-unlock";
