import { connection } from "next/server";
import { Suspense } from "react";
import { BootstrapAdminForm } from "@/components/bootstrap-admin-form";
import { LoginForm } from "@/components/login-form";
import { countAdmins } from "@/lib/actions/auth";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<p className="page max-w-md text-muted">Carregando…</p>}>
      <AdminLoginContent />
    </Suspense>
  );
}

async function AdminLoginContent() {
  await connection();
  const admins = await countAdmins();
  const firstRun = admins === 0;

  return (
    <main className="page max-w-md">
      <div className="card p-8">
        <p className="kicker">Administração</p>
        <h1 className="display mt-2 text-3xl">{firstRun ? "Primeiro acesso" : "Painel"}</h1>
        <p className="mt-2 text-sm text-muted">
          {firstRun
            ? "Ainda não há administrador. Crie o primeiro login para entrar no painel."
            : "Dashboard e cadastros internos."}
        </p>
        <div className="mt-6">
          {firstRun ? <BootstrapAdminForm /> : <LoginForm portal="admin" />}
        </div>
      </div>
    </main>
  );
}
