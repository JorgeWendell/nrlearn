import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { lessons } from "@/db/schema";
import { saveLessonMaterial } from "@/lib/lesson-material";
import { isUploadedFile } from "@/lib/lesson-upload";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "PROFESSOR") {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const formData = await request.formData();
    const courseId = String(formData.get("courseId") ?? "");
    const title = String(formData.get("title") ?? "").trim();
    const videoUrl = String(formData.get("videoUrl") ?? "").trim();
    const order = Number(formData.get("order") ?? 1);
    const moduleName = String(formData.get("moduleName") ?? "Módulo 1").trim() || "Módulo 1";
    const file = formData.get("material");

    if (!courseId || !title) {
      return NextResponse.json({ error: "Preencha o título da aula." }, { status: 400 });
    }

    let material: { materialPath: string; materialName: string; materialMime: string } | null = null;
    if (isUploadedFile(file)) {
      material = await saveLessonMaterial(file);
    }

    if (!videoUrl && !material) {
      return NextResponse.json(
        { error: "Informe a URL do vídeo ou envie um PDF/PowerPoint." },
        { status: 400 },
      );
    }

    await db.insert(lessons).values({
      courseId,
      title,
      videoUrl,
      order: Number.isFinite(order) ? order : 1,
      moduleName,
      materialPath: material?.materialPath ?? null,
      materialName: material?.materialName ?? null,
      materialMime: material?.materialMime ?? null,
    });

    revalidatePath(`/docente/cursos/${courseId}/aulas`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao salvar a aula.";
    console.error("POST /api/docente/lessons", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
