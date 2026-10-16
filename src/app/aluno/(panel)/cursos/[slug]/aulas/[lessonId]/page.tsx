import { notFound, redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { LessonPlayer } from "@/components/lesson-player";
import { db } from "@/db";
import { courses, enrollments, lessonProgress, lessons } from "@/db/schema";
import { isLessonUnlocked } from "@/lib/lesson-unlock";
import { requireAluno } from "@/lib/session";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const user = await requireAluno();
  const { slug, lessonId } = await params;
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

  const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
  if (!lesson || lesson.courseId !== course.id) notFound();

  const ordered = await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, course.id))
    .orderBy(asc(lessons.order));
  const progress = await db
    .select()
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, user.id));
  const completed = new Set(progress.map((p) => p.lessonId));

  if (!isLessonUnlocked(ordered, completed, lesson.id)) {
    redirect(`/aluno/cursos/${slug}`);
  }

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col p-6">
      <h1 className="mb-3 shrink-0 text-lg font-semibold">{lesson.title}</h1>
      <LessonPlayer
        lessonId={lesson.id}
        videoUrl={lesson.videoUrl}
        completed={completed.has(lesson.id)}
        materialName={lesson.materialName}
        materialMime={lesson.materialMime}
      />
    </div>
  );
}
