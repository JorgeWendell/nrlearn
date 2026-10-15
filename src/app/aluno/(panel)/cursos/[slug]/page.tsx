import { notFound, redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { CourseWatchEmpty } from "@/components/course-watch-shell";
import { PaidCourseLanding } from "@/components/paid-course-landing";
import { db } from "@/db";
import { assessments, courses, enrollments, lessons } from "@/db/schema";
import { requireAluno } from "@/lib/session";

function durationLabel(hours: number, seconds: number) {
  if (seconds > 0) {
    const h = Math.floor(seconds / 3600);
    const m = Math.round((seconds % 3600) / 60);
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  }
  return `${hours}h`;
}

export default async function AlunoCoursePage({
  params,
}: {
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
  const isPaid = Number(course.price) > 0;

  if (!hasAccess && !isPaid) {
    redirect(`/cursos/${slug}`);
  }

  if (hasAccess) {
    return <CourseWatchEmpty />;
  }

  const ordered = await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, course.id))
    .orderBy(asc(lessons.order));

  const tests = await db
    .select()
    .from(assessments)
    .where(eq(assessments.courseId, course.id))
    .orderBy(asc(assessments.order));

  if (!hasAccess && isPaid) {
    const totalSeconds = ordered.reduce((sum, lesson) => sum + (lesson.durationSeconds ?? 0), 0);
    return (
      <PaidCourseLanding
        courseId={course.id}
        slug={course.slug}
        title={course.title}
        description={course.description}
        category={course.category}
        level={course.level}
        coverUrl={course.coverUrl}
        price={course.price}
        durationLabel={durationLabel(course.workloadHours, totalSeconds)}
        lessonCount={ordered.length}
        hasCertificate={tests.length > 0}
        prerequisites={course.prerequisites}
        lessons={ordered.map((lesson) => ({ id: lesson.id, title: lesson.title, order: lesson.order }))}
        enrollmentStatus={enrollment?.status === "PENDENTE" ? "PENDENTE" : null}
      />
    );
  }

  notFound();
}
