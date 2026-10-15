const EMAIL = "fire.treinamentos.prevencao@gmail.com";
const WHATSAPP = "11939601643";
const WHATSAPP_DISPLAY = "11 93960-1643";

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
            <a
              href={`https://wa.me/55${WHATSAPP}`}
              className="font-semibold text-gold"
              target="_blank"
              rel="noreferrer"
            >
              {WHATSAPP_DISPLAY}
            </a>
          </p>
          <p>
            <span className="text-xs uppercase tracking-[0.16em] text-paper/45">E-mail</span>
            <br />
            <a href={`mailto:${EMAIL}`} className="text-paper">
              {EMAIL}
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
