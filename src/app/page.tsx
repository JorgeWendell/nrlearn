import Link from "next/link";
import { getFeaturedCourses } from "@/lib/catalog";
import { formatBRL } from "@/lib/format";

const WHATSAPP = "11939601643";
const WHATSAPP_DISPLAY = "11 93960-1643";
const EMAIL = "fire.treinamentos.prevencao@gmail.com";

const seguranca = [
  {
    title: "Inspeções de segurança",
    text: "Inspeções periódicas nos ambientes de trabalho para identificação de riscos e condições inseguras.",
  },
  {
    title: "Treinamentos",
    text: "Capacitações e DDS sobre segurança, saúde, uso de EPIs, prevenção de acidentes e normas regulamentadoras.",
  },
  {
    title: "CIPA",
    text: "Apoio na organização, eleições e gestão da CIPA, fortalecendo a participação dos colaboradores.",
  },
  {
    title: "Análise de riscos",
    text: "Elaboração de inventários de riscos, APR, PGR e planos de ação com foco na prevenção.",
  },
  {
    title: "Acompanhamento de atividades",
    text: "Acompanhamento de atividades críticas como trabalho em altura, espaços confinados, eletricidade, entre outras.",
  },
  {
    title: "EPI e EPC",
    text: "Orientação sobre o uso correto de EPIs e avaliação da eficácia dos EPCs.",
  },
  {
    title: "Cultura de segurança",
    text: "Ações de conscientização, campanhas e programas que incentivem atitudes seguras no dia a dia.",
  },
  {
    title: "Documentações",
    text: "Elaboração e controle de documentos legais, laudos, relatórios técnicos e indicadores de desempenho.",
  },
];

const prevencao = [
  {
    title: "Inspeções e testes",
    text: "Verificação de extintores, hidrantes, iluminação e sinalização de emergência e sistemas de alarme.",
  },
  {
    title: "Planos de emergência",
    text: "Elaboração e atualização de planos de emergência e rotas de fuga.",
  },
  {
    title: "Equipamentos de combate",
    text: "Ações de manutenção de equipamentos de combate a incêndio e detecção.",
  },
  {
    title: "Treinamentos e simulados",
    text: "Treinamentos de brigada de incêndio, uso de extintores e realização de simulados de evacuação.",
  },
  {
    title: "Brigada de incêndio",
    text: "Formação, reciclagem e gestão da brigada de incêndio.",
  },
  {
    title: "Sinalização e alarme",
    text: "Implementação e manutenção de sinalização de emergência e sistemas de alarme.",
  },
  {
    title: "Sistemas de proteção",
    text: "Gestão e manutenção de sistemas hidráulicos preventivos, sprinklers e casas de bombas.",
  },
  {
    title: "Documentação e normas",
    text: "Adequação às normas técnicas (NTs, NBRs, ITs do Corpo de Bombeiros) e emissão de laudos.",
  },
];

function ServiceGrid({
  items,
}: {
  items: { title: string; text: string }[];
}) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <article key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-sm font-bold uppercase tracking-wide text-ember">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-paper/70">{item.text}</p>
        </article>
      ))}
    </div>
  );
}

export default async function HomePage() {
  const published = await getFeaturedCourses();

  return (
    <main className="bg-[#070b12] text-paper">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#14080a] via-[#0a101c] to-[#070b12]">
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-ember/20 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ember">
              Segurança do trabalho e prevenção contra incêndios
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">Fire Prevenção</h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-paper/75 md:text-lg">
              Atuamos promovendo ambientes de trabalho seguros, saudáveis e em conformidade com as
              normas, preservando vidas, o patrimônio e a continuidade das operações.
            </p>
            <div className="mt-8 flex flex-col gap-3 text-sm font-semibold uppercase tracking-wide text-gold">
              <p>Segurança hoje, tranquilidade sempre.</p>
              <p>Prevenir é proteger.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/55${WHATSAPP}`}
                className="btn btn-primary"
                target="_blank"
                rel="noreferrer"
              >
                Falar no WhatsApp
              </a>
              <Link href="/cursos" className="btn btn-ghost">
                Ver cursos
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/fire.png" alt="Fire Prevenção" className="h-56 w-auto object-contain md:h-72" />
          </div>
        </div>
      </section>

      <section id="institucional" className="border-t border-white/10">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ember">Missão</p>
            <p className="mt-3 text-sm leading-relaxed text-paper/75">
              Prevenir acidentes e incêndios, protegendo pessoas, patrimônio e o meio ambiente.
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ember">Visão</p>
            <p className="mt-3 text-sm leading-relaxed text-paper/75">
              Ser referência em gestão de segurança e prevenção, promovendo uma cultura de cuidado e
              responsabilidade.
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ember">Valores</p>
            <ul className="mt-3 space-y-1.5 text-sm text-paper/75">
              <li>Vida em primeiro lugar</li>
              <li>Comprometimento</li>
              <li>Integridade</li>
              <li>Melhoria contínua</li>
              <li>Trabalho em equipe</li>
            </ul>
          </article>
        </div>
      </section>

      <section id="seguranca" className="mx-auto max-w-6xl px-4 py-6 pb-16">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Serviços</p>
        <h2 className="mt-2 font-serif text-3xl md:text-4xl">Segurança do trabalho</h2>
        <ServiceGrid items={seguranca} />
      </section>

      <section id="prevencao" className="border-t border-white/10 bg-[#0a0f18]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Serviços</p>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl">Prevenção contra incêndios</h2>
          <ServiceGrid items={prevencao} />
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

      <section id="cursos" className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Capacitação</p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">Cursos</h2>
          </div>
          <Link href="/cursos" className="hidden text-sm font-semibold text-ember md:inline">
            Ver todos →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {published.length === 0 ? (
            <p className="text-paper/55">O catálogo será publicado em breve.</p>
          ) : (
            published.map((course) => (
              <Link
                key={course.id}
                href={`/cursos/${course.slug}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-ember/40"
              >
                <span className="badge">{course.workloadHours}h</span>
                <h3 className="mt-4 font-serif text-2xl">{course.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-paper/65">
                  {course.description}
                </p>
                <p className="mt-5 font-semibold text-gold">{formatBRL(course.price)}</p>
              </Link>
            ))
          )}
        </div>
      </section>

      <section id="contato" className="border-t border-white/10 bg-[#14080a]">
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
