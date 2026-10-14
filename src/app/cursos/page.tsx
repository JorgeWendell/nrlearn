import Link from "next/link";
import { getPublishedCourses } from "@/lib/catalog";
import { formatBRL } from "@/lib/format";

export default async function CursosPage() {
  const list = await getPublishedCourses();

  return (
    <main className="page">
      <p className="kicker">Formação online</p>
      <h1 className="display mt-2 text-4xl md:text-5xl">Catálogo de cursos</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Capacitação em NRs e formação operacional. A matrícula é solicitada pelo aluno e
        liberada pela equipe docente.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {list.map((course) => (
          <Link key={course.id} href={`/cursos/${course.slug}`} className="card card-hover p-7">
            <span className="badge">{course.workloadHours} horas</span>
            <h2 className="display mt-4 text-2xl">{course.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{course.description}</p>
            <p className="mt-5 font-semibold text-navy">{formatBRL(course.price)}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
