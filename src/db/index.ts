import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  pg: ReturnType<typeof postgres> | undefined;
};

function getClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL não definida");
  }
  if (!globalForDb.pg) {
    globalForDb.pg = postgres(url, { max: 10 });
  }
  return globalForDb.pg;
}

export const db = drizzle(getClient(), { schema });
export type Database = typeof db;
