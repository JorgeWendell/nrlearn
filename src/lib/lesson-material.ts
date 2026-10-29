import { createWriteStream } from "node:fs";
import { mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const MAX_BYTES = 250 * 1024 * 1024;

const allowed: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
};

function extOf(name: string) {
  return path.extname(name).toLowerCase();
}

export function uploadsDir() {
  return path.join(process.cwd(), "uploads", "lessons");
}

export function materialDiskPath(storedName: string) {
  return path.join(uploadsDir(), storedName);
}

export async function saveLessonMaterial(file: File) {
  if (file.size === 0) return null;
  if (file.size > MAX_BYTES) {
    throw new Error("O arquivo deve ter no máximo 250 MB.");
  }

  const ext = extOf(file.name);
  const mime = (file.type || "").toLowerCase();
  const extOk = [".pdf", ".ppt", ".pptx"].includes(ext);
  if (!extOk) {
    throw new Error("Envie apenas PDF, PPT ou PPTX.");
  }

  const storedName = `${randomUUID()}${ext}`;
  await mkdir(uploadsDir(), { recursive: true });
  const dest = materialDiskPath(storedName);
  const nodeStream = Readable.fromWeb(file.stream() as Parameters<typeof Readable.fromWeb>[0]);
  await pipeline(nodeStream, createWriteStream(dest));

  const resolvedMime =
    mime && allowed[mime]
      ? mime
      : ext === ".pdf"
        ? "application/pdf"
        : ext === ".ppt"
          ? "application/vnd.ms-powerpoint"
          : "application/vnd.openxmlformats-officedocument.presentationml.presentation";

  return {
    materialPath: storedName,
    materialName: file.name.slice(0, 180),
    materialMime: resolvedMime,
  };
}

export async function removeLessonMaterial(storedName: string | null | undefined) {
  if (!storedName) return;
  try {
    await unlink(materialDiskPath(storedName));
  } catch {
    /* arquivo já ausente */
  }
}
