"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { assessments, courses, lessons, options, questions } from "@/db/schema";
import { slugify } from "@/lib/format";
import { removeLessonMaterial, saveLessonMaterial } from "@/lib/lesson-material";
import { requireProfessor } from "@/lib/session";

export async function upsertCourse(formData: FormData) {
  await requireProfessor();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const workloadHours = Number(formData.get("workloadHours") ?? 8);
  const price = String(formData.get("price") ?? "0");
  const published = formData.get("published") === "on";
  const category = String(formData.get("category") ?? "Geral").trim() || "Geral";
  const level = String(formData.get("level") ?? "Iniciante").trim() || "Iniciante";
  const coverUrl = String(formData.get("coverUrl") ?? "").trim() || null;
  const featured = formData.get("featured") === "on";
  const prerequisites = String(formData.get("prerequisites") ?? "").trim() || null;

  if (!title || !description) return { error: "Título e descrição são obrigatórios." };

  if (id) {
    await db
      .update(courses)
      .set({
        title,
        description,
        workloadHours,
        price,
        published,
        category,
        level,
        coverUrl,
        featured,
        prerequisites,
      })
      .where(eq(courses.id, id));
    revalidatePath("/docente");
    revalidatePath("/docente/cursos");
    revalidatePath(`/docente/cursos/${id}`);
    revalidatePath("/cursos");
    revalidatePath("/aluno/cursos");
    return { ok: true, id };
  }

  let slug = slugify(title);
  const [clash] = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  if (clash) slug = `${slug}-${Date.now().toString(36)}`;

  const [created] = await db
    .insert(courses)
    .values({
      title,
      description,
      workloadHours,
      price,
      published,
      slug,
      category,
      level,
      coverUrl,
      featured,
      prerequisites,
    })
    .returning();

  revalidatePath("/docente");
  revalidatePath("/docente/cursos");
  revalidatePath("/cursos");
  revalidatePath("/aluno/cursos");
  redirect(`/docente/cursos/${created.id}`);
}

export async function addLesson(formData: FormData) {
  await requireProfessor();
  const courseId = String(formData.get("courseId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();
  const order = Number(formData.get("order") ?? 1);
  const moduleName = String(formData.get("moduleName") ?? "Módulo 1").trim() || "Módulo 1";
  const file = formData.get("material");

  if (!courseId || !title) return { error: "Preencha o título da aula." };

  let material: { materialPath: string; materialName: string; materialMime: string } | null = null;
  if (file instanceof File && file.size > 0) {
    try {
      material = await saveLessonMaterial(file);
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Falha ao enviar o arquivo." };
    }
  }

  if (!videoUrl && !material) {
    return { error: "Informe a URL do vídeo ou envie um PDF/PowerPoint." };
  }

  await db.insert(lessons).values({
    courseId,
    title,
    videoUrl,
    order,
    moduleName,
    materialPath: material?.materialPath ?? null,
    materialName: material?.materialName ?? null,
    materialMime: material?.materialMime ?? null,
  });
  revalidatePath(`/docente/cursos/${courseId}/aulas`);
  return { ok: true };
}

export async function deleteLesson(lessonId: string, courseId: string) {
  await requireProfessor();
  const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
  await db.delete(lessons).where(eq(lessons.id, lessonId));
  await removeLessonMaterial(lesson?.materialPath);
  revalidatePath(`/docente/cursos/${courseId}/aulas`);
}

export async function addAssessment(formData: FormData) {
  await requireProfessor();
  const courseId = String(formData.get("courseId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const type = String(formData.get("type") ?? "PROVA") as "PROVA" | "QUIZ";
  const order = Number(formData.get("order") ?? 0);

  if (!courseId || !title) return { error: "Informe o título da avaliação." };

  const [created] = await db
    .insert(assessments)
    .values({ courseId, title, type, order })
    .returning();

  revalidatePath(`/docente/cursos/${courseId}/avaliacoes`);
  return { ok: true, id: created.id };
}

export async function addQuestion(formData: FormData) {
  await requireProfessor();
  const assessmentId = String(formData.get("assessmentId") ?? "");
  const courseId = String(formData.get("courseId") ?? "");
  const prompt = String(formData.get("prompt") ?? "").trim();
  const optionTexts = [1, 2, 3, 4].map((n) => String(formData.get(`option${n}`) ?? "").trim());
  const correct = Number(formData.get("correct") ?? 1);

  if (!assessmentId || !prompt || optionTexts.some((t) => !t)) {
    return { error: "Preencha o enunciado e as 4 alternativas." };
  }

  const existing = await db.select().from(questions).where(eq(questions.assessmentId, assessmentId));
  const [question] = await db
    .insert(questions)
    .values({ assessmentId, prompt, order: existing.length + 1 })
    .returning();

  await db.insert(options).values(
    optionTexts.map((text, i) => ({
      questionId: question.id,
      text,
      isCorrect: i + 1 === correct,
    })),
  );

  revalidatePath(`/docente/cursos/${courseId}/avaliacoes/${assessmentId}`);
  return { ok: true };
}
