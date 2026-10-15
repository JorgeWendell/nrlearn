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

function Cover({
  course,
  className,
}: {
  course: AlunoCatalogCourse;
  className?: string;
}) {
  if (course.coverUrl) {
    return (
      <div className={`overflow-hidden bg-[#0b1220] ${className ?? ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={course.coverUrl} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`grid place-items-center bg-gradient-to-br from-[#1e3a5f] via-[#0f172a] to-[#312e81] ${className ?? ""}`}
    >
      <span className="px-3 text-center text-sm font-semibold text-white/80">{course.title}</span>
    </div>
  );
}

function CourseCard({ course }: { course: AlunoCatalogCourse }) {
  const href = accessHref(course);
  const label = accessLabel(course);
  const locked = course.enrollmentStatus === "PENDENTE";

  return (
    <article className="w-[210px] shrink-0 overflow-hidden rounded-2xl border border-white/6 bg-[#101826]">
      <Cover course={course} className="h-[132px]" />
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{course.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/45">{course.description}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="rounded bg-white/8 px-1.5 py-0.5 text-[10px] text-white/60">{course.category}</span>
          <span className="rounded bg-white/8 px-1.5 py-0.5 text-[10px] text-white/60">{course.level}</span>
        </div>
        {locked ? (
          <p className="mt-3 text-xs text-white/35">{label}</p>
        ) : (
          <Link href={href} className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.5v13l11-6.5L8 5.5Z" />
            </svg>
            {label}
          </Link>
        )}
      </div>
    </article>
  );
}

function FeaturedCard({ course }: { course: AlunoCatalogCourse }) {
  const href = accessHref(course);
  const canStart =
    course.enrollmentStatus === "ATIVA" || course.enrollmentStatus === "CONCLUIDA";

  return (
    <article className="flex max-w-sm overflow-hidden rounded-2xl border border-white/6 bg-[#101826]">
      <Cover course={course} className="w-[42%] min-h-[220px]" />
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold leading-snug">{course.title}</h3>
        <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-white/50">{course.description}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          <span className="rounded bg-white/8 px-1.5 py-0.5 text-[10px] text-white/60">{course.category}</span>
          <span className="rounded bg-white/8 px-1.5 py-0.5 text-[10px] text-white/60">{course.level}</span>
        </div>
        <p className="mt-auto pt-4 text-xs text-white/40">{course.workloadHours} horas</p>
        {canStart ? (
          <Link
            href={href}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#f472b6]"
          >
            ▶ Começar agora
          </Link>
        ) : (
          <Link href={href} className="mt-3 text-xs text-white/55 hover:text-white">
            {accessLabel(course)}
          </Link>
        )}
      </div>
    </article>
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

      {free.length > 0 && (!category || category === "Gratuitos") ? (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">Gratuitos</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {free.map((course) => (
              <FeaturedCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      ) : null}

      {grouped.map(([group, items]) => (
        <section key={group} className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">{group}</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {items.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
