import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { assembleCoverUpload, removeCourseCover } from "@/lib/course-cover";
import { slugify } from "@/lib/format";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 300;

function revalidateCourse(id?: string) {
  revalidatePath("/docente");
  revalidatePath("/docente/cursos");
  revalidatePath("/cursos");
  revalidatePath("/aluno/cursos");
  if (id) revalidatePath(`/docente/cursos/${id}`);
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "PROFESSOR") {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const formData = await request.formData();
    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const workloadHours = Number(formData.get("workloadHours") ?? 8);
    const price = String(formData.get("price") ?? "0");
    const published = formData.get("published") === "on";
    const category = String(formData.get("category") ?? "Geral").trim() || "Geral";
    const level = String(formData.get("level") ?? "Iniciante").trim() || "Iniciante";
    const featured = formData.get("featured") === "on";
    const prerequisites = String(formData.get("prerequisites") ?? "").trim() || null;
    const uploadId = String(formData.get("coverUploadId") ?? "").trim();
    const coverName = String(formData.get("coverName") ?? "").trim();

    if (!title || !description) {
      return NextResponse.json({ error: "Título e descrição são obrigatórios." }, { status: 400 });
    }

    let coverUrl: string | null | undefined;
    if (uploadId && coverName) {
      coverUrl = await assembleCoverUpload(uploadId, coverName);
    }

    if (id) {
      const [existing] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
      if (!existing) {
        return NextResponse.json({ error: "Curso não encontrado." }, { status: 404 });
      }
      if (coverUrl && existing.coverUrl && existing.coverUrl !== coverUrl) {
        await removeCourseCover(existing.coverUrl);
      }
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
          featured,
          prerequisites,
          ...(coverUrl ? { coverUrl } : {}),
        })
        .where(eq(courses.id, id));
      revalidateCourse(id);
      return NextResponse.json({ ok: true, id });
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
        coverUrl: coverUrl ?? null,
        featured,
        prerequisites,
      })
      .returning();

    revalidateCourse(created.id);
    return NextResponse.json({ ok: true, id: created.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao salvar o curso.";
    console.error("POST /api/docente/courses", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
