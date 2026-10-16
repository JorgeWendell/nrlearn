import Link from "next/link";
import { BootstrapAdminForm } from "@/components/bootstrap-admin-form";
import { countAdmins } from "@/lib/admin";

const WHATSAPP = "11939601643";
const WHATSAPP_DISPLAY = "11 93960-1643";
const EMAIL = "fire.treinamentos.prevencao@gmail.com";

export default async function PrimeiroAcessoAdminPage() {
  const admins = await countAdmins();
  const firstRun = admins === 0;

  return (
    <main className="site-dark bg-[#070b12] text-paper">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#14080a] via-[#0a101c] to-[#070b12]">
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-ember/20 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Área restrita</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl">Primeiro acesso</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-paper/70">
            {firstRun
              ? "Crie o administrador admin@nrlearn.local para entrar no painel. Essa página só funciona enquanto não existir nenhum admin."
              : "Já existe um administrador. Entre com o e-mail e a senha cadastrados."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-xl px-4 py-10 pb-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ember">Administrador</p>
          <h2 className="mt-2 font-serif text-2xl">
            {firstRun ? "Criar login de admin" : "Conta já criada"}
          </h2>
          <p className="mt-2 text-sm text-paper/60">
            {firstRun
              ? "O e-mail já vem preenchido. Defina a senha (mínimo de 6 caracteres) e confirme."
              : "O primeiro administrador já está no banco. Use o login do painel."}
          </p>
          <div className="mt-6">
            {firstRun ? (
              <BootstrapAdminForm />
            ) : (
              <Link href="/admin/login" className="btn btn-primary inline-flex w-full justify-center">
                Ir para o login
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 border-y border-white/10 md:grid-cols-4">
        {[
          "Protegemos pessoas",
          "Preservamos patrimônio",
          "Garantimos conformidade",
          "Asseguramos a continuidade do negócio",
        ].map((item) => (
          <p
            key={item}
            className="border-white/10 px-4 py-5 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-paper/80 md:border-r md:last:border-r-0"
          >
            {item}
          </p>
        ))}
      </section>

      <section className="bg-[#14080a]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ember">Contato</p>
            <h2 className="mt-2 font-serif text-3xl">Fale com a Fire Prevenção</h2>
            <p className="mt-3 text-sm text-paper/65">Atendimento em São Paulo — SP e região.</p>
          </div>
          <div className="space-y-3 text-sm">
            <a
              href={`https://wa.me/55${WHATSAPP}`}
              className="block font-semibold text-gold hover:text-paper"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
            <a href={`mailto:${EMAIL}`} className="block text-paper/80 hover:text-gold">
              {EMAIL}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
