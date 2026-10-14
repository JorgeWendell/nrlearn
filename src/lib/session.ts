import { connection } from "next/server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function getSession() {
  await connection();
  return auth();
}

export async function requireUser() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");
  return session.user;
}

export async function requireAluno() {
  const user = await requireUser();
  if (user.role !== "ALUNO") redirect("/");
  return user;
}

export async function requireProfessor() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/docente/login");
  if (session.user.role !== "PROFESSOR") redirect("/docente/login");
  return session.user;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/admin/login");
  if (session.user.role !== "ADMIN") redirect("/admin/login");
  return session.user;
}
