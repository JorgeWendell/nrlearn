import { desc, eq } from "drizzle-orm";
import { CreateStaffForm } from "@/components/create-staff-form";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/lib/session";

export default async function CadastroProfessoresPage() {
  await requireAdmin();
  const professors = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.role, "PROFESSOR"))
    .orderBy(desc(users.createdAt));

  return (
    <main className="page max-w-5xl py-10">
      <p className="kicker">Cadastros</p>
      <h1 className="display mt-2 text-3xl md:text-4xl">Professor</h1>
      <p className="mt-2 text-sm text-muted">
        Contas docentes entram em <span className="font-medium text-navy">/docente/login</span>.
      </p>
      <section className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-serif text-2xl">Novo professor</h2>
          <div className="mt-6">
            <CreateStaffForm role="PROFESSOR" />
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-serif text-2xl">Cadastrados</h2>
          <ul className="mt-4 space-y-3">
            {professors.length === 0 ? (
              <li className="text-sm text-muted">Nenhum professor cadastrado ainda.</li>
            ) : (
              professors.map((professor) => (
                <li key={professor.id} className="border-b border-navy/10 pb-3">
                  <p className="font-medium">{professor.name}</p>
                  <p className="text-sm text-muted">{professor.email}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
