import Link from "next/link";
import { getPublishedCourses } from "@/lib/catalog";
import { formatBRL } from "@/lib/format";

const WHATSAPP = "11939601643";
const WHATSAPP_DISPLAY = "11 93960-1643";
const EMAIL = "fire.treinamentos.prevencao@gmail.com";

export default async function CursosPage() {
  const list = await getPublishedCourses();

  return (
    <main className="bg-[#070b12] text-paper">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#14080a] via-[#0a101c] to-[#070b12]">
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-ember/20 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Capacitação</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl">Cursos</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-paper/70">
            Capacitação em normas regulamentadoras, segurança do trabalho e prevenção contra
            incêndios. A matrícula é solicitada pelo aluno e liberada pela equipe.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 pb-16">
        {list.length === 0 ? (
          <p className="text-paper/55">O catálogo será publicado em breve.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {list.map((course) => (
              <Link
                key={course.id}
                href={`/cursos/${course.slug}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-ember/40"
              >
                <span className="badge">{course.workloadHours}h</span>
                <h2 className="mt-4 font-serif text-2xl">{course.title}</h2>
                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-paper/65">
                  {course.description}
                </p>
                <p className="mt-5 font-semibold text-gold">{formatBRL(course.price)}</p>
              </Link>
            ))}
          </div>
        )}
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

      <section className="border-t border-white/10 bg-[#14080a]">
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
