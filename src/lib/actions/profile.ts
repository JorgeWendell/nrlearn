"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { studentProfiles } from "@/db/schema";
import { requireAluno } from "@/lib/session";

const textFields = [
  "headline",
  "company",
  "location",
  "website",
  "linkedin",
  "github",
  "about",
] as const;

type TextField = (typeof textFields)[number];

export type StudentProfileData = {
  headline: string;
  company: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  about: string;
  notifyUpdates: boolean;
};

export async function getStudentProfile(userId: string): Promise<StudentProfileData> {
  const [row] = await db
    .select()
    .from(studentProfiles)
    .where(eq(studentProfiles.userId, userId))
    .limit(1);

  return {
    headline: row?.headline ?? "",
    company: row?.company ?? "",
    location: row?.location ?? "",
    website: row?.website ?? "",
    linkedin: row?.linkedin ?? "",
    github: row?.github ?? "",
    about: row?.about ?? "",
    notifyUpdates: row?.notifyUpdates ?? true,
  };
}

async function upsertProfile(userId: string, patch: Partial<StudentProfileData>) {
  const current = await getStudentProfile(userId);
  const next = { ...current, ...patch };

  await db
    .insert(studentProfiles)
    .values({
      userId,
      headline: next.headline || null,
      company: next.company || null,
      location: next.location || null,
      website: next.website || null,
      linkedin: next.linkedin || null,
      github: next.github || null,
      about: next.about || null,
      notifyUpdates: next.notifyUpdates,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: studentProfiles.userId,
      set: {
        headline: next.headline || null,
        company: next.company || null,
        location: next.location || null,
        website: next.website || null,
        linkedin: next.linkedin || null,
        github: next.github || null,
        about: next.about || null,
        notifyUpdates: next.notifyUpdates,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/aluno/curriculo");
}

function normalizeLink(value: string) {
  const trimmed = value.trim().slice(0, 2000);
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export async function updateProfileText(field: string, value: string) {
  const user = await requireAluno();
  if (!textFields.includes(field as TextField)) {
    return { error: "Campo inválido." };
  }
  const next =
    field === "linkedin" || field === "github" || field === "website"
      ? normalizeLink(value)
      : value.trim().slice(0, 2000);
  await upsertProfile(user.id, { [field]: next });
  return { ok: true };
}

export async function updateProfileNotify(enabled: boolean) {
  const user = await requireAluno();
  await upsertProfile(user.id, { notifyUpdates: enabled });
  return { ok: true };
}
