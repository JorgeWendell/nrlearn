import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { courses, enrollments } from "@/db/schema";
import { LogoutButton } from "@/components/logout-button";
import { requireAluno } from "@/lib/session";

export default async function AlunoHomePage() {
  const user = await requireAluno();
  const mine = await db
    .select({ enrollment: enrollments, course: courses })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.userId, user.id));

  return (
    <main className="page max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="kicker">Área do aluno</p>
          <h1 className="display mt-2 text-3xl md:text-4xl">Olá, {user.name}</h1>
        </div>
        <LogoutButton />
      </div>
      <div className="mt-8 flex gap-4 text-sm">
        <Link href="/cursos" className="font-semibold text-ember">
          Catálogo →
        </Link>
      </div>
      <h2 className="display mt-10 text-2xl">Meus cursos</h2>
      <div className="mt-4 space-y-3">
        {mine.length === 0 ? (
          <p className="text-muted">Você ainda não solicitou matrícula.</p>
        ) : (
          mine.map(({ enrollment, course }) => (
            <div key={enrollment.id} className="card flex items-center justify-between p-5">
              <div>
                <p className="font-medium">{course.title}</p>
                <p className="text-sm text-muted">Status: {enrollment.status}</p>
              </div>
              {enrollment.status === "ATIVA" || enrollment.status === "CONCLUIDA" ? (
                <Link href={`/aluno/cursos/${course.slug}`} className="text-sm font-semibold text-ember">
                  Continuar
                </Link>
              ) : (
                <span className="text-sm text-muted">Aguardando liberação</span>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
