import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CourseEnrollCta } from "@/components/course-enroll-cta";
import { getPublishedCourseBySlug } from "@/lib/catalog";
import { formatBRL } from "@/lib/format";

export default async function CoursePublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPublishedCourseBySlug(slug);
  if (!data) notFound();
  const { course, courseLessons } = data;

  return (
    <main className="page max-w-3xl">
      <span className="badge">{course.workloadHours} horas</span>
      <h1 className="display mt-4 text-4xl md:text-5xl">{course.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">{course.description}</p>
      <div className="card mt-8 p-6">
        <p className="text-2xl font-semibold text-navy">{formatBRL(course.price)}</p>
        <p className="mt-1 text-sm text-muted">{courseLessons.length} videoaulas</p>
        <div className="mt-6">
          <Suspense fallback={<p className="text-sm text-muted">Carregando matrícula…</p>}>
            <CourseEnrollCta courseId={course.id} courseSlug={course.slug} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
