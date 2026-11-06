import { NextResponse } from "next/server";
import { saveCoverChunk } from "@/lib/course-cover";
import { isUploadedFile } from "@/lib/lesson-upload";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "PROFESSOR") {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const formData = await request.formData();
    const chunk = formData.get("chunk");
    if (!isUploadedFile(chunk)) {
      return NextResponse.json({ error: "Parte do arquivo ausente." }, { status: 400 });
    }

    await saveCoverChunk({
      uploadId: String(formData.get("uploadId") ?? ""),
      index: Number(formData.get("index")),
      total: Number(formData.get("total")),
      filename: String(formData.get("filename") ?? ""),
      chunk,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao enviar a capa.";
    console.error("POST /api/docente/covers/chunk", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
