import Link from "next/link";
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
    <main className="bg-[#070b12] text-paper">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#14080a] via-[#0a101c] to-[#070b12]">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <Link href="/cursos" className="text-sm text-paper/50 hover:text-gold">
            ← Voltar aos cursos
          </Link>
          <span className="badge mt-6 inline-flex">{course.workloadHours} horas</span>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl">{course.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-paper/70">{course.description}</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-10 pb-16">
        <div className="max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-2xl font-semibold text-gold">{formatBRL(course.price)}</p>
          <p className="mt-1 text-sm text-paper/55">{courseLessons.length} videoaulas</p>
          <div className="mt-6">
            <Suspense fallback={<p className="text-sm text-paper/50">Carregando matrícula…</p>}>
              <CourseEnrollCta courseId={course.id} courseSlug={course.slug} />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
