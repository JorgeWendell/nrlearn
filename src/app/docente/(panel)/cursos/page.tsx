import Link from "next/link";
import { desc } from "drizzle-orm";
import { DeleteCourseButton } from "@/components/delete-course-button";
import { DocenteShell } from "@/components/docente-shell";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { formatBRL } from "@/lib/format";
import { requireProfessor } from "@/lib/session";

export default async function DocenteCursosPage() {
  await requireProfessor();
  const list = await db.select().from(courses).orderBy(desc(courses.createdAt));

  return (
    <DocenteShell kicker="Cursos" title="Visualizar">
      <div className="card p-6">
        {list.length === 0 ? (
          <p className="text-sm text-muted">
            Nenhum curso ainda.{" "}
            <Link href="/docente/cursos/novo" className="font-semibold text-ember">
              Criar o primeiro
            </Link>
          </p>
        ) : (
          <ul className="space-y-3">
            {list.map((course) => (
              <li key={course.id} className="flex items-start justify-between gap-3 border-b border-navy/10 pb-3 last:border-0">
                <div>
                  <Link href={`/docente/cursos/${course.id}`} className="font-medium hover:text-ember">
                    {course.title}
                  </Link>
                  <p className="text-sm text-muted">
                    {course.published ? "Publicado" : "Rascunho"} · {formatBRL(course.price)}
                  </p>
                </div>
                <DeleteCourseButton courseId={course.id} title={course.title} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </DocenteShell>
  );
}
