import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  pg: ReturnType<typeof postgres> | undefined;
  db: ReturnType<typeof createDb> | undefined;
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

function createDb() {
  if (!globalForDb.db) {
    globalForDb.db = drizzle(getClient(), { schema });
  }
  return globalForDb.db;
}

type Database = ReturnType<typeof createDb>;

export const db: Database = new Proxy({} as Database, {
  get(_target, prop, receiver) {
    const instance = createDb() as object;
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export type { Database };
