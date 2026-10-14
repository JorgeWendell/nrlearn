import Link from "next/link";
import { count, desc, eq, sql } from "drizzle-orm";
import { DocenteShell } from "@/components/docente-shell";
import { db } from "@/db";
import { courses, enrollments } from "@/db/schema";
import { requireProfessor } from "@/lib/session";

export default async function DocenteDashboardPage() {
  await requireProfessor();

  const perCourse = await db
    .select({
      id: courses.id,
      title: courses.title,
      published: courses.published,
      alunos: count(enrollments.id),
      emAndamento: sql<number>`coalesce(sum(case when ${enrollments.status} = 'ATIVA' then 1 else 0 end), 0)`,
    })
    .from(courses)
    .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
    .groupBy(courses.id, courses.title, courses.published)
    .orderBy(desc(courses.createdAt));

  const totalCursos = perCourse.length;
  const totalAlunos = perCourse.reduce((acc, row) => acc + Number(row.alunos), 0);

  return (
    <DocenteShell kicker="Dashboard" title="Visão geral">
      <section className="grid gap-4 sm:grid-cols-2">
        <article className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Cursos</p>
          <p className="display mt-3 text-4xl text-navy">{totalCursos}</p>
        </article>
        <article className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Alunos nas turmas
          </p>
          <p className="display mt-3 text-4xl text-navy">{totalAlunos}</p>
        </article>
      </section>

      <section className="card mt-8 p-6">
        <h2 className="font-serif text-2xl">Alunos por curso</h2>
        <ul className="mt-5 space-y-4">
          {perCourse.length === 0 ? (
            <li className="text-sm text-muted">Nenhum curso cadastrado.</li>
          ) : (
            perCourse.map((course) => (
              <li key={course.id} className="border-b border-navy/10 pb-4 last:border-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link href={`/docente/cursos/${course.id}`} className="font-medium hover:text-ember">
                    {course.title}
                  </Link>
                  <span className="text-xs text-muted">
                    {course.published ? "Publicado" : "Rascunho"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {Number(course.alunos)} aluno{Number(course.alunos) === 1 ? "" : "s"} ·{" "}
                  {Number(course.emAndamento)} em andamento
                </p>
              </li>
            ))
          )}
        </ul>
      </section>
    </DocenteShell>
  );
}
