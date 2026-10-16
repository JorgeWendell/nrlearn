import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { asc, eq } from "drizzle-orm";
import { DocenteShell } from "@/components/docente-shell";
import { LessonEditorForm } from "@/components/teacher-forms";
import { db } from "@/db";
import { courses, lessons } from "@/db/schema";
import { deleteLesson } from "@/lib/actions/teacher";
import { requireProfessor } from "@/lib/session";

export default function DocenteLessonsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-muted">Carregando aulas…</p>}>
      <DocenteLessons params={params} />
    </Suspense>
  );
}

async function DocenteLessons({ params }: { params: Promise<{ id: string }> }) {
  await requireProfessor();
  const { id } = await params;
  const [course] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  if (!course) notFound();

  const list = await db.select().from(lessons).where(eq(lessons.courseId, id)).orderBy(asc(lessons.order));

  return (
    <DocenteShell kicker="Cursos" title={`Aulas — ${course.title}`}>
      <Link href={`/docente/cursos/${id}`} className="text-sm font-semibold text-ember">
        ← Voltar ao curso
      </Link>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <section className="card p-6">
          <h2 className="font-serif text-2xl">Nova videoaula</h2>
          <div className="mt-6">
            <LessonEditorForm courseId={id} nextOrder={list.length + 1} />
          </div>
        </section>
        <section className="card p-6">
          <h2 className="font-serif text-2xl">Ordem das aulas</h2>
          <ol className="mt-4 space-y-3">
            {list.length === 0 ? (
              <li className="text-sm text-muted">Nenhuma aula cadastrada.</li>
            ) : (
              list.map((lesson) => (
                <li key={lesson.id} className="flex items-start justify-between gap-3 border-b border-navy/10 pb-3">
                  <div>
                    <p className="font-medium">
                      {lesson.order}. {lesson.title}
                    </p>
                    <p className="break-all text-xs text-muted">
                      {lesson.videoUrl || "Sem vídeo"}
                      {lesson.materialName ? ` · ${lesson.materialName}` : ""}
                    </p>
                  </div>
                  <form
                    action={async () => {
                      "use server";
                      await deleteLesson(lesson.id, id);
                    }}
                  >
                    <button className="text-sm text-ember">Remover</button>
                  </form>
                </li>
              ))
            )}
          </ol>
        </section>
      </div>
    </DocenteShell>
  );
}
