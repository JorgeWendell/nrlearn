import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { coverContentType, coverDiskPath, resolveCoverFile } from "@/lib/course-cover";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const segments = (await params).path;
  const filename = await resolveCoverFile(segments.join("/"));
  if (!filename) {
    return NextResponse.json({ error: "Capa não encontrada." }, { status: 404 });
  }

  try {
    const disk = coverDiskPath(filename);
    const info = await stat(disk);
    const stream = Readable.toWeb(createReadStream(disk)) as ReadableStream;
    return new NextResponse(stream, {
      headers: {
        "Content-Type": coverContentType(filename),
        "Content-Length": String(info.size),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Capa não encontrada." }, { status: 404 });
  }
}
