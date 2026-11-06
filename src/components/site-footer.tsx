import Link from "next/link";
import { WhatsAppLinks } from "@/components/whatsapp-links";
import { CONTACT_EMAIL } from "@/lib/contact";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#070b12] text-paper/80">
      <div className="border-t-4 border-ember bg-[#12080a]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-sm md:flex-row md:items-center md:justify-between">
          <WhatsAppLinks className="font-semibold text-paper hover:text-gold" />
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-gold">
            {CONTACT_EMAIL}
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
