import Link from "next/link";
import { getFeaturedCourses } from "@/lib/catalog";
import { formatBRL } from "@/lib/format";

export default async function HomePage() {
  const published = await getFeaturedCourses();

  return (
    <main>
      <section className="relative overflow-hidden bg-navy text-paper">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-ember/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
        <div className="page relative grid gap-12 py-20 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <div>
            <p className="kicker text-gold">Escola técnica</p>
            <h1 className="display mt-4 text-4xl leading-[1.05] md:text-6xl">
              Formação para quem atua na linha de frente.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-paper/72">
              Cursos de bombeiro civil, brigada de incêndio e Normas Regulamentadoras com
              videoaulas, provas e acompanhamento de progresso.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/cursos" className="btn btn-primary">
                Ver catálogo
              </Link>
              <Link href="/login" className="btn btn-ghost">
                Acesso Alunos
              </Link>
            </div>
          </div>
          <div className="card border-white/10 bg-white/8 p-8 text-paper">
            <p className="kicker text-gold">Foco da instituição</p>
            <ul className="mt-5 space-y-4 text-paper/90">
              {[
                "NR-10, NR-12, NR-18, NR-23, NR-33 e NR-35",
                "Formação e reciclagem de brigadistas",
                "Procedimentos de emergência e resgate",
                "Certificação com prova online (2 tentativas)",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ember" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="page py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="kicker">Catálogo</p>
            <h2 className="display mt-2 text-3xl md:text-4xl">Cursos em destaque</h2>
          </div>
          <Link href="/cursos" className="hidden text-sm font-semibold text-ember md:inline">
            Ver todos →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {published.length === 0 ? (
            <p className="text-muted">O catálogo será publicado em breve.</p>
          ) : (
            published.map((course) => (
              <Link
                key={course.id}
                href={`/cursos/${course.slug}`}
                className="card card-hover p-6"
              >
                <span className="badge">{course.workloadHours}h</span>
                <h3 className="display mt-4 text-2xl">{course.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                  {course.description}
                </p>
                <p className="mt-5 font-semibold text-navy">{formatBRL(course.price)}</p>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
