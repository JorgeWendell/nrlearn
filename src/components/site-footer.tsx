import Link from "next/link";

const EMAIL = "fire.treinamentos.prevencao@gmail.com";
const WHATSAPP = "11939601643";
const WHATSAPP_DISPLAY = "11 93960-1643";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#070b12] text-paper/80">
      <div className="border-t-4 border-ember bg-[#12080a]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-sm md:flex-row md:items-center md:justify-between">
          <a
            href={`https://wa.me/55${WHATSAPP}`}
            className="font-semibold text-paper hover:text-gold"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
          <a href={`mailto:${EMAIL}`} className="hover:text-gold">
            {EMAIL}
          </a>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_1fr_auto] md:items-start">
        <div>
          <p className="font-serif text-2xl text-paper">Fire Prevenção</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/65">
            Segurança do trabalho e prevenção contra incêndios. Atendimento a
            nivel Brasil.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm">
          <Link href="/#seguranca" className="hover:text-gold">
            Segurança
          </Link>
          <Link href="/#prevencao" className="hover:text-gold">
            Prevenção
          </Link>
          <Link href="/cursos" className="hover:text-gold">
            Cursos
          </Link>
          <Link href="/contato" className="hover:text-gold">
            Contato
          </Link>
        </div>
        <p className="text-sm text-paper/55 md:text-right">© 2026 AdelWeb</p>
      </div>
    </footer>
  );
}
