import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { coverContentType, coverDiskPath, isSafeCoverName } from "@/lib/course-cover";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  if (!isSafeCoverName(filename)) {
    return NextResponse.json({ error: "Capa não encontrada." }, { status: 404 });
  }

  try {
    const info = await stat(coverDiskPath(filename));
    const stream = Readable.toWeb(createReadStream(coverDiskPath(filename))) as ReadableStream;
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
