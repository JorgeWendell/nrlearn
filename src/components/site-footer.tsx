import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-navy text-paper/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.2fr_1fr_auto] md:items-start">
        <div>
          <p className="font-serif text-2xl text-paper">NRLearn</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/65">
            Capacitação em normas regulamentadoras e formação para equipes de emergência
            e brigadas de incêndio.
          </p>
        </div>
        <div className="flex gap-6 text-sm">
          <Link href="/cursos" className="hover:text-gold">
            Catálogo
          </Link>
          <Link href="/contato" className="hover:text-gold">
            Contato
          </Link>
          <Link href="/login" className="hover:text-gold">
            Alunos
          </Link>
        </div>
        <p className="text-sm text-paper/55 md:text-right">© 2026 AdelWeb</p>
      </div>
    </footer>
  );
}
