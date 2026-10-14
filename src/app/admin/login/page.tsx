import { LoginForm } from "@/components/login-form";

export default function AdminLoginPage() {
  return (
    <main className="page max-w-md">
      <div className="card p-8">
        <p className="kicker">Administração</p>
        <h1 className="display mt-2 text-3xl">Painel</h1>
        <p className="mt-2 text-sm text-muted">Dashboard e cadastros internos.</p>
        <div className="mt-6">
          <LoginForm portal="admin" />
        </div>
      </div>
    </main>
  );
}
