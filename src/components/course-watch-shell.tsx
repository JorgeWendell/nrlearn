"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { isLessonUnlocked } from "@/lib/lesson-unlock";

export type WatchLesson = {
  id: string;
  title: string;
  order: number;
  moduleName: string;
};

export type WatchAssessment = {
  id: string;
  title: string;
  type: "PROVA" | "QUIZ";
};

function groupModules(lessons: WatchLesson[]) {
  const groups: { name: string; lessons: WatchLesson[] }[] = [];
  for (const lesson of lessons) {
    const name = lesson.moduleName || "Módulo 1";
    const last = groups.at(-1);
    if (!last || last.name !== name) groups.push({ name, lessons: [lesson] });
    else last.lessons.push(lesson);
  }
  return groups;
}

export function CourseWatchShell({
  slug,
  title,
  lessons,
  assessments,
  completedIds,
  children,
}: {
  slug: string;
  title: string;
  lessons: WatchLesson[];
  assessments: WatchAssessment[];
  completedIds: string[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const completed = useMemo(() => new Set(completedIds), [completedIds]);
  const modules = useMemo(() => groupModules(lessons), [lessons]);
  const activeLessonId = pathname.split("/aulas/")[1]?.split("/")[0] ?? null;
  const percent = lessons.length === 0 ? 0 : Math.round((completed.size / lessons.length) * 100);

  const initialOpen = modules.findIndex((mod) => mod.lessons.some((l) => l.id === activeLessonId));
  const [open, setOpen] = useState<Set<number>>(
    () => new Set([initialOpen >= 0 ? initialOpen : 0]),
  );

  function toggle(index: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="aluno-app fixed inset-0 z-[80] flex flex-col bg-[#070b14]">
      <header className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-white/5 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/aluno/cursos" className="text-white/50 hover:text-white" aria-label="Voltar">
            ←
          </Link>
          <span className="grid h-7 w-7 place-items-center rounded-md bg-white/5 text-white/70">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="4" y="5" width="16" height="14" rx="2" />
              <path d="m10 9 6 4-6 4V9Z" />
            </svg>
          </span>
          <p className="truncate text-sm font-medium">{title}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden h-1.5 w-40 overflow-hidden rounded-full bg-white/10 sm:block">
            <div className="h-full rounded-full bg-[#ec4899]" style={{ width: `${percent}%` }} />
          </div>
          <span className="text-xs font-semibold text-[#ec4899]">{percent}%</span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[260px] shrink-0 flex-col overflow-y-auto border-r border-white/5 bg-[#080d16]">
          <div className="flex items-center justify-between px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
            <span>Conteúdo</span>
            <span>
              {completed.size}/{lessons.length}
            </span>
          </div>
          <div className="px-2 pb-4">
            {modules.map((mod, index) => {
              const doneCount = mod.lessons.filter((l) => completed.has(l.id)).length;
              const expanded = open.has(index);
              return (
                <div key={`${mod.name}-${index}`} className="mb-1">
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    className="flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left hover:bg-white/5"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-white/20 text-[10px] text-white/50">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{mod.name}</span>
                      <span className="text-[11px] text-white/35">
                        {doneCount} de {mod.lessons.length} aulas
                      </span>
                    </span>
                    <span className="mt-1 text-white/30">{expanded ? "▾" : "›"}</span>
                  </button>
                  {expanded ? (
                    <ul className="mb-2 ml-4 space-y-0.5 border-l border-white/10 pl-3">
                      {mod.lessons.map((lesson) => {
                        const unlocked = isLessonUnlocked(lessons, completed, lesson.id);
                        const active = lesson.id === activeLessonId;
                        const done = completed.has(lesson.id);
                        if (!unlocked) {
                          return (
                            <li key={lesson.id} className="rounded-md px-2 py-1.5 text-xs text-white/25">
                              {lesson.title}
                            </li>
                          );
                        }
                        return (
                          <li key={lesson.id}>
                            <Link
                              href={`/aluno/cursos/${slug}/aulas/${lesson.id}`}
                              className={`block rounded-md px-2 py-1.5 text-xs ${
                                active ? "bg-[#6d28d9]/40 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              {done ? "✓ " : ""}
                              {lesson.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              );
            })}
            {assessments.length > 0 ? (
              <div className="mt-4 border-t border-white/10 pt-3">
                <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                  Avaliações
                </p>
                {assessments.map((item) => (
                  <Link
                    key={item.id}
                    href={`/aluno/cursos/${slug}/avaliacoes/${item.id}`}
                    className={`block rounded-md px-2 py-1.5 text-xs ${
                      pathname.includes(item.id)
                        ? "bg-[#6d28d9]/40 text-white"
                        : "text-white/65 hover:bg-white/5"
                    }`}
                  >
                    {item.type === "PROVA" ? "Prova" : "Quiz"} — {item.title}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </aside>
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export function CourseWatchEmpty() {
  return (
    <div className="grid flex-1 place-items-center px-6 text-center">
      <div>
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-[#ec4899]">
          <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.5v13l11-6.5L8 5.5Z" />
          </svg>
        </div>
        <p className="text-lg font-medium">Pronto para começar?</p>
        <p className="mt-2 text-sm text-white/40">Selecione uma aula na barra lateral para assistir</p>
      </div>
    </div>
  );
}
