import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { RegisterForm } from "@/components/register-form";

export default function LoginPage() {
  return (
    <main className="page grid w-full max-w-5xl gap-6 md:grid-cols-2">
      <section className="card p-8">
        <p className="kicker">Alunos</p>
        <h1 className="display mt-2 text-3xl">Entrar</h1>
        <p className="mt-2 text-sm text-muted">Acesse videoaulas, provas e seu progresso.</p>
        <div className="mt-6">
          <LoginForm portal="aluno" />
        </div>
      </section>
      <section className="card p-8">
        <p className="kicker">Primeiro acesso</p>
        <h2 className="display mt-2 text-3xl">Criar conta</h2>
        <p className="mt-2 text-sm text-muted">Cadastro exclusivo para alunos.</p>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="mt-8 text-xs text-muted">
          Área docente e administrativa usam endereços próprios, fora do menu do site.
        </p>
        <p className="mt-2 hidden">
          <Link href="/docente/login">docente</Link>
        </p>
      </section>
    </main>
  );
}
