import { createHmac, timingSafeEqual } from "node:crypto";

function secret() {
  return process.env.AUTH_SECRET ?? "dev-material-secret";
}

export function signMaterialToken(lessonId: string, ttlMs = 12 * 60 * 60 * 1000) {
  const exp = String(Date.now() + ttlMs);
  const payload = `${lessonId}.${exp}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifyMaterialToken(token: string, lessonId: string) {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const lastDot = raw.lastIndexOf(".");
    if (lastDot < 0) return false;
    const payload = raw.slice(0, lastDot);
    const sig = raw.slice(lastDot + 1);
    const [id, exp] = payload.split(".");
    if (id !== lessonId || Number(exp) < Date.now()) return false;
    const expected = createHmac("sha256", secret()).update(payload).digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function isOfficeMaterial(mime?: string | null, name?: string | null) {
  const value = `${mime ?? ""} ${name ?? ""}`.toLowerCase();
  return value.includes("powerpoint") || value.includes(".ppt");
}

export function isPdfMaterial(mime?: string | null, name?: string | null) {
  const value = `${mime ?? ""} ${name ?? ""}`.toLowerCase();
  return value.includes("pdf");
}
