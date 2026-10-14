import Link from "next/link";
import { getSession } from "@/lib/session";

export function SiteHeaderFallback() {
  return <SiteHeaderFrame alunoHref="/login" />;
}

export async function SiteHeader() {
  const session = await getSession();
  const alunoHref = session?.user?.role === "ALUNO" ? "/aluno" : "/login";

  return <SiteHeaderFrame alunoHref={alunoHref} />;
}

function SiteHeaderFrame({ alunoHref }: { alunoHref: string }) {
  return (
    <header className="glass-header sticky top-0 z-40 text-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ember font-serif text-lg font-bold text-white shadow-[0_10px_24px_-12px_rgba(226,58,40,0.9)]">
            NR
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-[1.35rem] tracking-tight">NRLearn</span>
            <span className="block text-[11px] uppercase tracking-[0.22em] text-gold/90">
              Bombeiros & NRs
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-paper/80 md:flex">
          <Link href="/" className="transition hover:text-gold">
            Início
          </Link>
          <Link href="/cursos" className="transition hover:text-gold">
            Cursos
          </Link>
          <Link href="/contato" className="transition hover:text-gold">
            Contato
          </Link>
        </nav>
        <Link href={alunoHref} className="btn btn-primary px-4 py-2 text-xs uppercase tracking-[0.14em]">
          Acesso Alunos
        </Link>
      </div>
    </header>
  );
}
