import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { enrollments } from "@/db/schema";
import { requestEnrollment } from "@/lib/actions/enrollment";
import { getSession } from "@/lib/session";

export async function CourseEnrollCta({
  courseId,
  courseSlug,
}: {
  courseId: string;
  courseSlug: string;
}) {
  const session = await getSession();
  let enrollment = null;
  if (session?.user?.id && session.user.role === "ALUNO") {
    const [row] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, session.user.id), eq(enrollments.courseId, courseId)))
      .limit(1);
    enrollment = row ?? null;
  }

  if (!session) {
    return (
      <a href="/login" className="btn btn-primary">
        Entrar para se matricular
      </a>
    );
  }

  if (session.user.role !== "ALUNO") {
    return <p className="text-sm text-muted">Matrícula disponível apenas para alunos.</p>;
  }

  if (enrollment?.status === "PENDENTE") {
    return (
      <p className="rounded-2xl bg-gold/20 px-4 py-3 text-sm">
        Matrícula solicitada. Aguarde a liberação do professor.
      </p>
    );
  }

  if (enrollment?.status === "ATIVA" || enrollment?.status === "CONCLUIDA") {
    return (
      <a
        href={`/aluno/cursos/${courseSlug}`}
        className="btn btn-navy"
      >
        Ir para o curso
      </a>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await requestEnrollment(courseId);
      }}
    >
      <button className="btn btn-primary">
        Solicitar matrícula
      </button>
    </form>
  );
}
