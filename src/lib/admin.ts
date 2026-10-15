import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function countAdmins() {
  const [row] = await db.select({ total: count() }).from(users).where(eq(users.role, "ADMIN"));
  return Number(row?.total ?? 0);
}
