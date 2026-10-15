import { desc, eq } from "drizzle-orm";
import { AlunoPageHeader } from "@/components/aluno-page-header";
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
    <div>
      <AlunoPageHeader
        crumbs={["Início", "Cadastros", "Admin"]}
        title="Admin"
        subtitle="Novos usuários entram em /admin/login com permissão total do painel."
      />
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
    </div>
  );
}
