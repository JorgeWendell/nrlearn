import { execSync } from "node:child_process";
import postgres from "postgres";

const user = process.env.POSTGRES_USER ?? "nrlearn";
const password = process.env.POSTGRES_PASSWORD ?? "";
const database = process.env.POSTGRES_DB ?? "nrlearn";
const host = process.env.POSTGRES_HOST ?? "db";
const port = process.env.POSTGRES_PORT ?? "5432";

if (!password) {
  console.error("Erro: POSTGRES_PASSWORD não definida.");
  process.exit(1);
}

const databaseUrl = `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
process.env.DATABASE_URL = databaseUrl;
process.env.CI = "true";

console.log(`Conectando em ${host}:${port}/${database} como ${user}...`);

const sql = postgres(databaseUrl, { max: 1 });

try {
  await sql`SELECT 1`;
  console.log("Conexão com PostgreSQL OK.");
} catch (error) {
  console.error("Erro ao conectar no PostgreSQL:", error);
  process.exit(1);
} finally {
  await sql.end({ timeout: 5 });
}

try {
  console.log("Aplicando schema (drizzle-kit push)...");
  execSync("npx drizzle-kit push --force", {
    stdio: "inherit",
    env: process.env,
  });
  console.log("Schema aplicado.");
} catch (error) {
  console.error("Falha ao aplicar schema:", error);
  process.exit(1);
}
