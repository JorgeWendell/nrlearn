import { desc, eq } from "drizzle-orm";
import { CreateStaffForm } from "@/components/create-staff-form";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/lib/session";

export default async function CadastroAdminsPage() {
  const admin = await requireAdmin();
  const admins = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.role, "ADMIN"))
    .orderBy(desc(users.createdAt));

  return (
    <main className="page max-w-5xl py-10">
      <p className="kicker">Cadastros</p>
      <h1 className="display mt-2 text-3xl md:text-4xl">Admin</h1>
      <p className="mt-2 text-sm text-muted">
        Novos usuários entram em <span className="font-medium text-navy">/admin/login</span> com
        permissão total do painel.
      </p>
      <section className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-serif text-2xl">Novo administrador</h2>
          <div className="mt-6">
            <CreateStaffForm role="ADMIN" />
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-serif text-2xl">Cadastrados</h2>
          <ul className="mt-4 space-y-3">
            {admins.map((person) => (
              <li key={person.id} className="border-b border-navy/10 pb-3">
                <p className="font-medium">{person.name}</p>
                <p className="text-sm text-muted">
                  {person.email}
                  {person.id === admin.id ? " · você" : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
