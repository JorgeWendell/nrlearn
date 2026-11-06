import { WhatsAppLinks } from "@/components/whatsapp-links";
import { CONTACT_EMAIL } from "@/lib/contact";

export default function ContatoPage() {
  return (
    <main className="bg-[#070b12] text-paper">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-ember">Contato</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">Fale conosco</h1>
        <p className="mt-4 text-paper/65">Atendimento em São Paulo — SP e região.</p>
        <div className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-white/5 p-7">
          <p>
            <span className="text-xs uppercase tracking-[0.16em] text-paper/45">WhatsApp</span>
            <br />
            <WhatsAppLinks stacked className="font-semibold text-gold hover:text-paper" />
          </p>
          <p>
            <span className="text-xs uppercase tracking-[0.16em] text-paper/45">E-mail</span>
            <br />
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-paper">
              {CONTACT_EMAIL}
            </a>
          </p>
          <p>
            <span className="text-xs uppercase tracking-[0.16em] text-paper/45">Atendimento</span>
            <br />
            São Paulo — SP e região
          </p>
        </div>
      </div>
    </main>
  );
}
