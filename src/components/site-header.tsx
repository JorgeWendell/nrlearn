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
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fire.png" alt="Fire Prevenção" className="h-24 w-auto object-contain md:h-36" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/treina.png" alt="Fire Treinamentos" className="h-24 w-auto object-contain md:h-36" />
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
