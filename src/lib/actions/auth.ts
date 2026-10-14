"use server";

import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { signIn, signOut } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/lib/session";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const portal = String(formData.get("portal") ?? "aluno");
  const redirectTo =
    portal === "admin" ? "/admin" : portal === "docente" ? "/docente" : "/aluno";

  try {
    await signIn("credentials", { email, password, portal, redirectTo });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email ou senha inválidos para este acesso." };
    }
    throw error;
  }
}

export async function registerAlunoAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (name.length < 3 || !email.includes("@") || password.length < 6) {
    return { error: "Preencha nome, email válido e senha com ao menos 6 caracteres." };
  }

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) return { error: "Já existe uma conta com este email." };

  await db.insert(users).values({
    name,
    email,
    passwordHash: await hash(password, 10),
    role: "ALUNO",
  });

  try {
    await signIn("credentials", {
      email,
      password,
      portal: "aluno",
      redirectTo: "/aluno",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Conta criada, mas o login automático falhou. Entre em /login." };
    }
    throw error;
  }
}

export async function createStaffAction(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "");

  if (role !== "PROFESSOR" && role !== "ADMIN") {
    return { error: "Permissão inválida." };
  }

  if (name.length < 3 || !email.includes("@") || password.length < 6) {
    return { error: "Preencha nome, email válido e senha com ao menos 6 caracteres." };
  }

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) return { error: "Já existe uma conta com este email." };

  await db.insert(users).values({
    name,
    email,
    passwordHash: await hash(password, 10),
    role,
  });

  revalidatePath("/admin");
  return {
    success:
      role === "ADMIN"
        ? "Administrador criado. Ele entra em /admin/login com este email e senha."
        : "Professor criado. Ele entra em /docente/login com este email e senha.",
  };
}

export async function createProfessorAction(formData: FormData) {
  formData.set("role", "PROFESSOR");
  return createStaffAction(formData);
}

export async function createAdminAction(formData: FormData) {
  formData.set("role", "ADMIN");
  return createStaffAction(formData);
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
