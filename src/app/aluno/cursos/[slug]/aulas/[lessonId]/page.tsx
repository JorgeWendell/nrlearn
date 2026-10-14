import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { LessonPlayer } from "@/components/lesson-player";
import { db } from "@/db";
import { courses, enrollments, lessonProgress, lessons } from "@/db/schema";
import { isLessonUnlocked } from "@/lib/progress";
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
    redirect(`/cursos/${slug}`);
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
    <main className="page max-w-4xl">
      <Link href={`/aluno/cursos/${slug}`} className="text-sm font-semibold text-ember">
        ← Voltar ao curso
      </Link>
      <h1 className="display mt-4 text-3xl md:text-4xl">{lesson.title}</h1>
      <div className="mt-6">
        <LessonPlayer
          lessonId={lesson.id}
          videoUrl={lesson.videoUrl}
          completed={completed.has(lesson.id)}
        />
      </div>
    </main>
  );
}
