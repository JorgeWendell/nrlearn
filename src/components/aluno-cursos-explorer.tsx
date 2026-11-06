"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type AlunoCatalogCourse = {
  id: string;
  slug: string;
  title: string;
  description: string;
  workloadHours: number;
  price: string;
  category: string;
  level: string;
  coverUrl: string | null;
  featured: boolean;
  enrollmentStatus: "PENDENTE" | "ATIVA" | "CONCLUIDA" | null;
};

function isFree(price: string) {
  return Number(price) === 0;
}

function accessHref(course: AlunoCatalogCourse) {
  return `/aluno/cursos/${course.slug}`;
}

function accessLabel(course: AlunoCatalogCourse) {
  if (course.enrollmentStatus === "ATIVA" || course.enrollmentStatus === "CONCLUIDA") {
    return "Começar agora";
  }
  if (course.enrollmentStatus === "PENDENTE") return "Aguardando liberação";
  return "Assista para acessar";
}

function Cover({ course }: { course: AlunoCatalogCourse }) {
  if (course.coverUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={course.coverUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(ellipse_at_20%_0%,#3b82f6_0%,transparent_42%),radial-gradient(ellipse_at_100%_80%,#7c3aed_0%,transparent_46%),linear-gradient(160deg,#0b1220,#1e1b4b)]">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:22px_22px]" />
    </div>
  );
}

function CourseCard({ course }: { course: AlunoCatalogCourse }) {
  const href = accessHref(course);
  const label = accessLabel(course);
  const locked = course.enrollmentStatus === "PENDENTE";
  const enrolled =
    course.enrollmentStatus === "ATIVA" || course.enrollmentStatus === "CONCLUIDA";
  const free = isFree(course.price);

  const card = (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-[#101826] shadow-[0_10px_32px_rgba(0,0,0,0.28)] transition duration-200 hover:-translate-y-1 hover:border-white/16 hover:shadow-[0_18px_44px_rgba(0,0,0,0.42)]">
      <div className="relative h-44 shrink-0 overflow-hidden">
        <Cover course={course} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101826] via-[#101826]/20 to-black/10" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/90 backdrop-blur-sm">
            {free ? "Gratuito" : "Pago"}
          </span>
          {enrolled ? (
            <span className="rounded-full bg-[#ec4899] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Matriculado
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-[2.6rem] text-[15px] font-semibold leading-snug text-white">
          {course.title}
        </h3>
        <p className="mt-2 line-clamp-2 min-h-[2.4rem] text-xs leading-relaxed text-white/45">
          {course.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-white/8 px-2 py-0.5 text-[10px] text-white/60">
            {course.category}
          </span>
          <span className="rounded-md bg-white/8 px-2 py-0.5 text-[10px] text-white/60">
            {course.level}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="text-xs text-white/40">{course.workloadHours} horas</span>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
              locked ? "text-white/35" : "text-white/80 group-hover:text-white"
            }`}
          >
            {locked ? (
              label
            ) : (
              <>
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5.5v13l11-6.5L8 5.5Z" />
                </svg>
                {label}
              </>
            )}
          </span>
        </div>
      </div>
    </article>
  );

  if (locked) {
    return <div className="h-full opacity-80">{card}</div>;
  }

  return (
    <Link href={href} className="block h-full">
      {card}
    </Link>
  );
}

function CourseGrid({ courses }: { courses: AlunoCatalogCourse[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

export function AlunoCursosExplorer({ courses }: { courses: AlunoCatalogCourse[] }) {
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set(courses.map((c) => c.category).filter(Boolean));
    return Array.from(set);
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter((course) => {
      if (!category) return true;
      if (category === "Gratuitos") return isFree(course.price);
      return course.category === category;
    });
  }, [courses, category]);

  const hero = filtered.find((c) => c.featured) ?? filtered[0] ?? null;
  const free = filtered.filter((c) => isFree(c.price));
  const grouped = useMemo(() => {
    const map = new Map<string, AlunoCatalogCourse[]>();
    for (const course of filtered) {
      if (isFree(course.price)) continue;
      const list = map.get(course.category) ?? [];
      list.push(course);
      map.set(course.category, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const chips = ["Gratuitos", ...categories];
  const showSections = !category;
  const showSingleGrid = Boolean(category);

  return (
    <div>
      {hero ? (
        <section className="relative -mx-5 mb-8 overflow-hidden md:-mx-8">
          <div className="relative h-[280px] md:h-[320px]">
            {hero.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero.coverUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(ellipse_at_70%_40%,#facc15_0%,#1c1917_55%,#020617_100%)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b1220] via-[#0b1220]/80 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end px-5 pb-8 md:px-8">
              <div className="flex flex-wrap gap-2">
                <span className="rounded bg-[#ec4899]/90 px-2 py-0.5 text-[10px] font-semibold uppercase">
                  {hero.category}
                </span>
                <span className="rounded bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase">
                  {hero.level}
                </span>
              </div>
              <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">{hero.title}</h2>
              <p className="mt-2 max-w-lg text-sm text-white/60">
                {hero.workloadHours} horas · {hero.category}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {hero.enrollmentStatus === "PENDENTE" ? (
                  <span className="text-sm text-white/50">Aguardando liberação</span>
                ) : (
                  <Link
                    href={accessHref(hero)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#ec4899] px-4 py-2 text-sm font-semibold text-white hover:bg-[#f472b6]"
                  >
                    ▶ Começar agora
                  </Link>
                )}
                <Link href={`/aluno/cursos/${hero.slug}`} className="text-sm text-white/70 hover:text-white">
                  Saiba mais
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <div className="mb-8 flex flex-wrap gap-2">
        {chips.map((chip) => {
          const active = category === chip;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => setCategory(active ? null : chip)}
              className={`rounded-full px-3 py-1 text-xs ${
                active ? "bg-white text-[#0b1220]" : "bg-white/8 text-white/65 hover:bg-white/12"
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-white/50">Nenhum curso encontrado.</p>
      ) : null}

      {showSingleGrid && filtered.length > 0 ? (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">{category}</h2>
          <CourseGrid courses={filtered} />
        </section>
      ) : null}

      {showSections && free.length > 0 ? (
        <section className="mb-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="text-lg font-semibold">Gratuitos</h2>
            <p className="text-xs text-white/35">{free.length} cursos</p>
          </div>
          <CourseGrid courses={free} />
        </section>
      ) : null}

      {showSections
        ? grouped.map(([group, items]) => (
            <section key={group} className="mb-10">
              <div className="mb-4 flex items-end justify-between gap-3">
                <h2 className="text-lg font-semibold">{group}</h2>
                <p className="text-xs text-white/35">{items.length} cursos</p>
              </div>
              <CourseGrid courses={items} />
            </section>
          ))
        : null}
    </div>
  );
}
