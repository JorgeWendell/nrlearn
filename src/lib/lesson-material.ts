import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MAX_BYTES = 40 * 1024 * 1024;

const allowed: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
};

function extOf(name: string) {
  const ext = path.extname(name).toLowerCase();
  return ext;
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
    throw new Error("O arquivo deve ter no máximo 40 MB.");
  }

  const ext = extOf(file.name);
  const mime = file.type || "";
  const mimeOk = Object.entries(allowed).some(
    ([type, exts]) => (mime === type || mime === "") && exts.includes(ext),
  );
  const extOk = [".pdf", ".ppt", ".pptx"].includes(ext);
  if (!mimeOk && !extOk) {
    throw new Error("Envie apenas PDF, PPT ou PPTX.");
  }

  const storedName = `${randomUUID()}${ext}`;
  await mkdir(uploadsDir(), { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(materialDiskPath(storedName), buffer);

  const resolvedMime =
    mime && allowed[mime] ? mime : ext === ".pdf" ? "application/pdf" : ext === ".ppt"
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
