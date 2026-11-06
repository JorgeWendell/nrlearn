"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { courses, enrollments, revenueEntries } from "@/db/schema";
import { requireAluno, requireProfessor } from "@/lib/session";

export async function ensureFreeEnrollment(
  userId: string,
  course: { id: string; slug: string; price: string; published: boolean },
) {
  if (!course.published || Number(course.price) !== 0) return null;

  const [existing] = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, course.id)))
    .limit(1);

  if (existing?.status === "ATIVA" || existing?.status === "CONCLUIDA") return existing;

  const now = new Date();
  if (existing) {
    const [updated] = await db
      .update(enrollments)
      .set({ status: "ATIVA", releasedAt: now })
      .where(eq(enrollments.id, existing.id))
      .returning();
    return updated ?? existing;
  }

  const [created] = await db
    .insert(enrollments)
    .values({
      userId,
      courseId: course.id,
      status: "ATIVA",
      releasedAt: now,
    })
    .returning();
  return created;
}

export async function requestEnrollment(courseId: string) {
  const user = await requireAluno();
  const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course?.published) return { error: "Curso indisponível." };

  const [existing] = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, user.id), eq(enrollments.courseId, courseId)))
    .limit(1);

  if (existing) return { error: "Você já solicitou este curso." };

  const free = Number(course.price) === 0;
  await db.insert(enrollments).values({
    userId: user.id,
    courseId,
    status: free ? "ATIVA" : "PENDENTE",
    releasedAt: free ? new Date() : null,
  });

  revalidatePath(`/cursos/${course.slug}`);
  revalidatePath("/aluno");
  revalidatePath("/aluno/cursos");
  revalidatePath(`/aluno/cursos/${course.slug}`);
  return { ok: true };
}

export async function releaseEnrollment(enrollmentId: string) {
  await requireProfessor();

  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.id, enrollmentId))
    .limit(1);

  if (!enrollment) return { error: "Matrícula não encontrada." };
  if (enrollment.status !== "PENDENTE") return { error: "Esta matrícula já foi tratada." };

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, enrollment.courseId))
    .limit(1);
  if (!course) return { error: "Curso não encontrado." };

  const now = new Date();
  await db
    .update(enrollments)
    .set({ status: "ATIVA", releasedAt: now })
    .where(eq(enrollments.id, enrollmentId));

  await db.insert(revenueEntries).values({
    courseId: course.id,
    enrollmentId: enrollment.id,
    amount: course.price,
    occurredAt: now,
  });

  revalidatePath("/docente");
  revalidatePath(`/docente/cursos/${course.id}/alunos`);
  revalidatePath("/admin");
  return { ok: true };
}
