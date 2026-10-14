import { count, countDistinct, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { courses, enrollments, revenueEntries, users } from "@/db/schema";

export async function getAdminMetrics() {
  const [alunos] = await db
    .select({ total: count() })
    .from(users)
    .where(eq(users.role, "ALUNO"));

  const [emAndamento] = await db
    .select({ total: countDistinct(enrollments.userId) })
    .from(enrollments)
    .where(eq(enrollments.status, "ATIVA"));

  const perCourse = await db
    .select({
      id: courses.id,
      title: courses.title,
      total: sql<string>`coalesce(sum(${revenueEntries.amount}), 0)`.as("total"),
    })
    .from(courses)
    .leftJoin(revenueEntries, eq(revenueEntries.courseId, courses.id))
    .groupBy(courses.id, courses.title)
    .orderBy(desc(sql`coalesce(sum(${revenueEntries.amount}), 0)`));

  const monthlyRaw = await db
    .select({
      month: sql<Date>`date_trunc('month', ${revenueEntries.occurredAt})`.as("month"),
      total: sql<string>`coalesce(sum(${revenueEntries.amount}), 0)`.as("total"),
    })
    .from(revenueEntries)
    .groupBy(sql`date_trunc('month', ${revenueEntries.occurredAt})`)
    .orderBy(sql`date_trunc('month', ${revenueEntries.occurredAt})`);

  const monthlyMap = new Map<string, number>();
  for (const row of monthlyRaw) {
    const d = new Date(row.month);
    monthlyMap.set(`${d.getUTCFullYear()}-${d.getUTCMonth()}`, Number(row.total) || 0);
  }

  const now = new Date();
  const monthly = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11 + i, 1));
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
    return {
      label: d.toLocaleDateString("pt-BR", { month: "short", year: "numeric", timeZone: "UTC" }),
      total: monthlyMap.get(key) ?? 0,
      isCurrent: i === 11,
    };
  });

  const monthRevenue = monthly.at(-1)?.total ?? 0;
  const totalRevenue = perCourse.reduce((acc, row) => acc + (Number(row.total) || 0), 0);

  return {
    alunosCadastrados: Number(alunos?.total ?? 0),
    alunosEmAndamento: Number(emAndamento?.total ?? 0),
    monthRevenue,
    totalRevenue,
    perCourse: perCourse.map((row) => ({
      id: row.id,
      title: row.title,
      total: Number(row.total) || 0,
    })),
    monthly,
  };
}
