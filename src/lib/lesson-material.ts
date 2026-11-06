import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, readdir, rm, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

export const MAX_MATERIAL_BYTES = 250 * 1024 * 1024;

const allowed: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
};

function extOf(name: string) {
  return path.extname(name).toLowerCase();
}

export function assertMaterialFilename(name: string) {
  const ext = extOf(name);
  if (![".pdf", ".ppt", ".pptx"].includes(ext)) {
    throw new Error("Envie apenas PDF, PPT ou PPTX.");
  }
  return ext;
}

function mimeOf(ext: string, mime: string) {
  const type = mime.toLowerCase();
  if (type && allowed[type]) return type;
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".ppt") return "application/vnd.ms-powerpoint";
  return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
}

export function uploadsDir() {
  return path.join(process.cwd(), "uploads", "lessons");
}

export function materialDiskPath(storedName: string) {
  return path.join(uploadsDir(), storedName);
}

function assertUploadId(uploadId: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uploadId)) {
    throw new Error("Upload inválido.");
  }
}

export function tmpUploadDir(uploadId: string) {
  assertUploadId(uploadId);
  return path.join(uploadsDir(), "tmp", uploadId);
}

export async function saveLessonChunk(input: {
  uploadId: string;
  index: number;
  total: number;
  filename: string;
  chunk: File;
}) {
  const ext = assertMaterialFilename(input.filename);
  if (!Number.isInteger(input.index) || !Number.isInteger(input.total) || input.total < 1 || input.index < 0 || input.index >= input.total) {
    throw new Error("Parte do arquivo inválida.");
  }
  if (input.total > 80) {
    throw new Error("O arquivo deve ter no máximo 250 MB.");
  }
  if (input.chunk.size <= 0 || input.chunk.size > 8 * 1024 * 1024) {
    throw new Error("Parte do arquivo inválida.");
  }

  const dir = tmpUploadDir(input.uploadId);
  await mkdir(dir, { recursive: true });
  const dest = path.join(dir, `${String(input.index).padStart(4, "0")}${ext}`);
  const nodeStream = Readable.fromWeb(input.chunk.stream() as Parameters<typeof Readable.fromWeb>[0]);
  await pipeline(nodeStream, createWriteStream(dest));
  return { ok: true as const };
}

export async function assembleLessonUpload(uploadId: string, filename: string) {
  const ext = assertMaterialFilename(filename);
  const dir = tmpUploadDir(uploadId);
  const parts = (await readdir(dir))
    .filter((name) => name.endsWith(ext))
    .sort();
  if (parts.length === 0) {
    throw new Error("O envio do arquivo foi interrompido. Envie novamente.");
  }

  let total = 0;
  for (const part of parts) {
    total += (await stat(path.join(dir, part))).size;
  }
  if (total > MAX_MATERIAL_BYTES) {
    await rm(dir, { recursive: true, force: true });
    throw new Error("O arquivo deve ter no máximo 250 MB.");
  }

  const storedName = `${randomUUID()}${ext}`;
  await mkdir(uploadsDir(), { recursive: true });
  const dest = materialDiskPath(storedName);
  try {
    await pipeline(createReadStream(path.join(dir, parts[0])), createWriteStream(dest));
    for (const part of parts.slice(1)) {
      await pipeline(createReadStream(path.join(dir, part)), createWriteStream(dest, { flags: "a" }));
    }
    const written = (await stat(dest)).size;
    if (written !== total) {
      throw new Error("O envio do arquivo foi interrompido. Envie novamente.");
    }
  } catch (error) {
    await unlink(dest).catch(() => undefined);
    throw error;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }

  return {
    materialPath: storedName,
    materialName: filename.slice(0, 180),
    materialMime: mimeOf(ext, ""),
  };
}

export async function saveLessonMaterial(file: File) {
  if (file.size === 0) return null;
  if (file.size > MAX_MATERIAL_BYTES) {
    throw new Error("O arquivo deve ter no máximo 250 MB.");
  }

  const ext = assertMaterialFilename(file.name);
  const storedName = `${randomUUID()}${ext}`;
  await mkdir(uploadsDir(), { recursive: true });
  const dest = materialDiskPath(storedName);
  const nodeStream = Readable.fromWeb(file.stream() as Parameters<typeof Readable.fromWeb>[0]);
  try {
    await pipeline(nodeStream, createWriteStream(dest));
    const written = (await stat(dest)).size;
    if (file.size > 0 && written !== file.size) {
      throw new Error("O envio do arquivo foi interrompido. Envie novamente.");
    }
  } catch (error) {
    await unlink(dest).catch(() => undefined);
    throw error;
  }

  return {
    materialPath: storedName,
    materialName: file.name.slice(0, 180),
    materialMime: mimeOf(ext, file.type || ""),
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
