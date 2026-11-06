import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, readdir, rm, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

export const MAX_COVER_BYTES = 20 * 1024 * 1024;
const COVER_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

function extOf(name: string) {
  return path.extname(name).toLowerCase();
}

export function assertCoverFilename(name: string) {
  const ext = extOf(name);
  if (!COVER_EXTS.includes(ext)) {
    throw new Error("Envie uma imagem JPG, PNG, WEBP ou GIF.");
  }
  return ext;
}

function mimeOf(ext: string) {
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
}

export function coversDir() {
  return path.join(process.cwd(), "uploads", "covers");
}

export function coverDiskPath(storedName: string) {
  return path.join(coversDir(), storedName);
}

export function coverPublicUrl(storedName: string) {
  return `/api/covers/${storedName}`;
}

export function storedCoverName(url: string | null | undefined) {
  const match = url?.match(/^\/api\/covers\/([0-9a-f-]+\.(?:jpe?g|png|webp|gif))$/i);
  return match?.[1] ?? null;
}

export function isSafeCoverName(name: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:jpe?g|png|webp|gif)$/i.test(
    name,
  );
}

function assertUploadId(uploadId: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uploadId)) {
    throw new Error("Upload inválido.");
  }
}

function tmpCoverDir(uploadId: string) {
  assertUploadId(uploadId);
  return path.join(coversDir(), "tmp", uploadId);
}

export async function saveCoverChunk(input: {
  uploadId: string;
  index: number;
  total: number;
  filename: string;
  chunk: File;
}) {
  const ext = assertCoverFilename(input.filename);
  if (
    !Number.isInteger(input.index) ||
    !Number.isInteger(input.total) ||
    input.total < 1 ||
    input.index < 0 ||
    input.index >= input.total
  ) {
    throw new Error("Parte do arquivo inválida.");
  }
  if (input.total > 8) {
    throw new Error("A capa deve ter no máximo 20 MB.");
  }
  if (input.chunk.size <= 0 || input.chunk.size > 8 * 1024 * 1024) {
    throw new Error("Parte do arquivo inválida.");
  }

  const dir = tmpCoverDir(input.uploadId);
  await mkdir(dir, { recursive: true });
  const dest = path.join(dir, `${String(input.index).padStart(4, "0")}${ext}`);
  const nodeStream = Readable.fromWeb(input.chunk.stream() as Parameters<typeof Readable.fromWeb>[0]);
  await pipeline(nodeStream, createWriteStream(dest));
  return { ok: true as const };
}

export async function assembleCoverUpload(uploadId: string, filename: string) {
  const ext = assertCoverFilename(filename);
  const dir = tmpCoverDir(uploadId);
  const parts = (await readdir(dir)).filter((name) => name.endsWith(ext)).sort();
  if (parts.length === 0) {
    throw new Error("O envio da capa foi interrompido. Envie novamente.");
  }

  let total = 0;
  for (const part of parts) {
    total += (await stat(path.join(dir, part))).size;
  }
  if (total > MAX_COVER_BYTES) {
    await rm(dir, { recursive: true, force: true });
    throw new Error("A capa deve ter no máximo 20 MB.");
  }

  const storedName = `${randomUUID()}${ext === ".jpeg" ? ".jpg" : ext}`;
  await mkdir(coversDir(), { recursive: true });
  const dest = coverDiskPath(storedName);
  try {
    await pipeline(createReadStream(path.join(dir, parts[0])), createWriteStream(dest));
    for (const part of parts.slice(1)) {
      await pipeline(createReadStream(path.join(dir, part)), createWriteStream(dest, { flags: "a" }));
    }
  } catch (error) {
    await unlink(dest).catch(() => undefined);
    throw error;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }

  return coverPublicUrl(storedName);
}

export async function removeCourseCover(url: string | null | undefined) {
  const name = storedCoverName(url);
  if (!name) return;
  await unlink(coverDiskPath(name)).catch(() => undefined);
}

export function coverContentType(name: string) {
  return mimeOf(extOf(name));
}
