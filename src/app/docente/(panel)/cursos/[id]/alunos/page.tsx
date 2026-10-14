import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { desc, eq } from "drizzle-orm";
import { DocenteShell } from "@/components/docente-shell";
import { db } from "@/db";
import { courses, enrollments, users } from "@/db/schema";
import { releaseEnrollment } from "@/lib/actions/enrollment";
import { requireProfessor } from "@/lib/session";

export default function DocenteStudentsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-muted">Carregando alunos…</p>}>
      <DocenteStudents params={params} />
    </Suspense>
  );
}

async function DocenteStudents({ params }: { params: Promise<{ id: string }> }) {
  await requireProfessor();
  const { id } = await params;
  const [course] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  if (!course) notFound();

  const rows = await db
    .select({
      enrollment: enrollments,
      student: users,
    })
    .from(enrollments)
    .innerJoin(users, eq(enrollments.userId, users.id))
    .where(eq(enrollments.courseId, id))
    .orderBy(desc(enrollments.requestedAt));

  return (
    <DocenteShell kicker="Cursos" title={`Alunos — ${course.title}`}>
      <Link href={`/docente/cursos/${id}`} className="text-sm font-semibold text-ember">
        ← Voltar ao curso
      </Link>
      <ul className="mt-6 space-y-3">
        {rows.length === 0 ? (
          <li className="text-sm text-muted">Nenhuma matrícula neste curso.</li>
        ) : (
          rows.map(({ enrollment, student }) => (
            <li
              key={enrollment.id}
              className="card flex flex-wrap items-center justify-between gap-3 p-5"
            >
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-muted">
                  {student.email} · {enrollment.status}
                </p>
              </div>
              {enrollment.status === "PENDENTE" ? (
                <form
                  action={async () => {
                    "use server";
                    await releaseEnrollment(enrollment.id);
                  }}
                >
                  <button className="btn btn-primary py-2 text-sm">Liberar matrícula</button>
                </form>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </DocenteShell>
  );
}
