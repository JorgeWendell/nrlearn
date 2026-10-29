import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { enrollments, lessons } from "@/db/schema";
import { materialDiskPath } from "@/lib/lesson-material";
import { verifyMaterialToken } from "@/lib/material-token";
import { getSession } from "@/lib/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  const { lessonId } = await params;
  const token = new URL(request.url).searchParams.get("t") ?? "";
  const session = await getSession();

  const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
  if (!lesson?.materialPath) {
    return NextResponse.json({ error: "Material não encontrado." }, { status: 404 });
  }

  const tokenOk = token.length > 0 && verifyMaterialToken(token, lessonId);
  if (!tokenOk) {
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }
    const role = session.user.role;
    if (role === "ALUNO") {
      const [enrollment] = await db
        .select()
        .from(enrollments)
        .where(and(eq(enrollments.userId, session.user.id), eq(enrollments.courseId, lesson.courseId)))
        .limit(1);
      if (!enrollment || (enrollment.status !== "ATIVA" && enrollment.status !== "CONCLUIDA")) {
        return NextResponse.json({ error: "Sem acesso." }, { status: 403 });
      }
    } else if (role !== "PROFESSOR" && role !== "ADMIN") {
      return NextResponse.json({ error: "Sem acesso." }, { status: 403 });
    }
  }

  const disk = materialDiskPath(lesson.materialPath);
  try {
    const info = await stat(disk);
    const stream = Readable.toWeb(createReadStream(disk)) as ReadableStream;
    const filename = (lesson.materialName ?? "material").replace(/"/g, "");
    return new NextResponse(stream, {
      headers: {
        "Content-Type": lesson.materialMime ?? "application/octet-stream",
        "Content-Length": String(info.size),
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "private, max-age=300",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return NextResponse.json({ error: "Arquivo ausente." }, { status: 404 });
  }
}
