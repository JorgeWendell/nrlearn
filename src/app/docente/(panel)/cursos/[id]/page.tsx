import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { eq } from "drizzle-orm";
import { DocenteShell } from "@/components/docente-shell";
import { CourseEditorForm } from "@/components/teacher-forms";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { requireProfessor } from "@/lib/session";

export default function DocenteCoursePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-muted">Carregando curso…</p>}>
      <DocenteCourse params={params} />
    </Suspense>
  );
}

async function DocenteCourse({ params }: { params: Promise<{ id: string }> }) {
  await requireProfessor();
  const { id } = await params;
  const [course] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  if (!course) notFound();

  const links = [
    { href: `/docente/cursos/${id}/aulas`, label: "Videoaulas" },
    { href: `/docente/cursos/${id}/avaliacoes`, label: "Provas e quizzes" },
    { href: `/docente/cursos/${id}/alunos`, label: "Alunos matriculados" },
  ];

  return (
    <DocenteShell kicker="Cursos" title={course.title}>
      <nav className="flex flex-wrap gap-3 text-sm">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="btn btn-outline px-4 py-2">
            {item.label}
          </Link>
        ))}
      </nav>
      <section className="card mt-8 p-6">
        <h2 className="font-serif text-2xl">Dados do curso</h2>
        <div className="mt-6">
          <CourseEditorForm course={course} />
        </div>
      </section>
    </DocenteShell>
  );
}
