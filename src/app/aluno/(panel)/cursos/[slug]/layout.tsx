import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { CourseWatchShell } from "@/components/course-watch-shell";
import { db } from "@/db";
import { assessments, courses, enrollments, lessonProgress, lessons } from "@/db/schema";
import { requireAluno } from "@/lib/session";

export default async function CourseWatchLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const user = await requireAluno();
  const { slug } = await params;
  const [course] = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  if (!course) notFound();

  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, user.id), eq(enrollments.courseId, course.id)))
    .limit(1);

  const hasAccess = enrollment?.status === "ATIVA" || enrollment?.status === "CONCLUIDA";
  if (!hasAccess) return children;

  const ordered = await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, course.id))
    .orderBy(asc(lessons.order));

  const progress = await db
    .select()
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, user.id));
  const lessonIds = new Set(ordered.map((item) => item.id));
  const completedIds = progress.filter((item) => lessonIds.has(item.lessonId)).map((item) => item.lessonId);

  const tests = await db
    .select()
    .from(assessments)
    .where(eq(assessments.courseId, course.id))
    .orderBy(asc(assessments.order));

  return (
    <CourseWatchShell
      slug={course.slug}
      title={course.title}
      lessons={ordered.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.order,
        moduleName: lesson.moduleName,
      }))}
      assessments={tests.map((item) => ({ id: item.id, title: item.title, type: item.type }))}
      completedIds={completedIds}
    >
      {children}
    </CourseWatchShell>
  );
}
