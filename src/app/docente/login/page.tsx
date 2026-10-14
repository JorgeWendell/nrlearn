import { LoginForm } from "@/components/login-form";

export default function DocenteLoginPage() {
  return (
    <main className="page max-w-md">
      <div className="card p-8">
        <p className="kicker text-gold">Área restrita</p>
        <h1 className="display mt-2 text-3xl">Acesso docente</h1>
        <p className="mt-2 text-sm text-muted">
          Este endereço não aparece no site institucional. Contas de professor são criadas no
          painel em /admin.
        </p>
        <div className="mt-6">
          <LoginForm portal="docente" />
        </div>
      </div>
    </main>
  );
}
