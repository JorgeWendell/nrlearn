import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { assessments, courses, enrollments, lessonProgress, lessons } from "@/db/schema";
import { isLessonUnlocked } from "@/lib/progress";
import { requireAluno } from "@/lib/session";

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

  if (!enrollment || (enrollment.status !== "ATIVA" && enrollment.status !== "CONCLUIDA")) {
    redirect(`/cursos/${slug}`);
  }

  const ordered = await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, course.id))
    .orderBy(asc(lessons.order));

  const progress = await db
    .select()
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, user.id));
  const completed = new Set(progress.map((p) => p.lessonId));

  const tests = await db
    .select()
    .from(assessments)
    .where(eq(assessments.courseId, course.id))
    .orderBy(asc(assessments.order));

  return (
    <main className="page max-w-3xl">
      <Link href="/aluno" className="text-sm font-semibold text-ember">
        ← Meus cursos
      </Link>
      <h1 className="display mt-4 text-3xl md:text-4xl">{course.title}</h1>
      <p className="mt-2 text-sm text-muted">
        {completed.size}/{ordered.length} aulas concluídas
      </p>

      <h2 className="mt-8 font-serif text-xl">Videoaulas</h2>
      <ol className="mt-3 space-y-2">
        {ordered.map((lesson, i) => {
          const unlocked = isLessonUnlocked(ordered, completed, lesson.id);
          const done = completed.has(lesson.id);
          return (
            <li key={lesson.id} className="card p-4">
              {unlocked ? (
                <Link href={`/aluno/cursos/${slug}/aulas/${lesson.id}`} className="flex justify-between">
                  <span>
                    {i + 1}. {lesson.title}
                  </span>
                  {done ? (
                    <span className="text-sm font-semibold text-emerald-700">Concluído</span>
                  ) : (
                    <span className="text-sm text-muted">Assistir</span>
                  )}
                </Link>
              ) : (
                <p className="text-muted">
                  {i + 1}. {lesson.title} — bloqueada
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <h2 className="mt-10 font-serif text-xl">Provas e quizzes</h2>
      <ul className="mt-3 space-y-2">
        {tests.map((item) => (
          <li key={item.id} className="card p-4">
            <Link href={`/aluno/cursos/${slug}/avaliacoes/${item.id}`} className="flex justify-between">
              <span>
                {item.type === "PROVA" ? "Prova" : "Quiz"} — {item.title}
              </span>
              <span className="text-sm text-ember">Abrir</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
