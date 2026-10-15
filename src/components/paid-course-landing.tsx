"use client";

import Link from "next/link";
import { useState, useTransition, type ReactNode } from "react";
import { requestEnrollment } from "@/lib/actions/enrollment";
import { formatBRL } from "@/lib/format";

export type PaidCourseLandingProps = {
  courseId: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  coverUrl: string | null;
  price: string;
  durationLabel: string;
  lessonCount: number;
  hasCertificate: boolean;
  prerequisites: string | null;
  lessons: { id: string; title: string; order: number }[];
  enrollmentStatus: "PENDENTE" | null;
};

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[#ec4899]">{icon}</span>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export function PaidCourseLanding(props: PaidCourseLandingProps) {
  const [tab, setTab] = useState<"geral" | "conteudo" | "prereq">("geral");
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(props.enrollmentStatus);

  function startJourney() {
    startTransition(async () => {
      const result = await requestEnrollment(props.courseId);
      if (!result?.error) setStatus("PENDENTE");
    });
  }

  const tabs = [
    { id: "geral" as const, label: "Visão Geral" },
    { id: "conteudo" as const, label: "Conteúdo do Curso" },
    { id: "prereq" as const, label: "Pré-requisitos" },
  ];

  return (
    <div className="pb-10">
      <Link href="/aluno/cursos" className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white">
        ← Voltar para cursos
      </Link>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#ec4899]/20 px-2.5 py-0.5 text-[11px] font-semibold text-[#f9a8d4]">
              {props.category}
            </span>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
              {props.level}
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-bold uppercase tracking-tight md:text-5xl">{props.title}</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/50">{props.description}</p>

          <div className="mt-8 flex gap-6 border-b border-white/10 text-sm">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`-mb-px border-b-2 pb-3 ${
                  tab === item.id
                    ? "border-[#ec4899] text-white"
                    : "border-transparent text-white/45 hover:text-white/80"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === "geral" ? (
            <div className="mt-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-2xl border border-white/8 bg-white/[0.03] px-6 py-5 sm:grid-cols-3">
                <Stat
                  label="Duração"
                  value={props.durationLabel}
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="8" />
                      <path d="M12 8v4l2.5 1.5" />
                    </svg>
                  }
                />
                <Stat
                  label="Aulas"
                  value={String(props.lessonCount)}
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 19V6a2 2 0 0 1 2-2h13v13H6a2 2 0 0 0-2 2Z" />
                      <path d="M8 8h8M8 12h5" />
                    </svg>
                  }
                />
                <Stat
                  label="Idioma"
                  value="Português"
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3 12h18M12 3c3 4 3 14 0 18M12 3c-3 4-3 14 0 18" />
                    </svg>
                  }
                />
                <Stat
                  label="Nível"
                  value={props.level}
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
                    </svg>
                  }
                />
                <Stat
                  label="Certificação"
                  value={props.hasCertificate ? "Sim" : "Não"}
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="9" r="5" />
                      <path d="M8.5 13.5 7 21l5-2.5L17 21l-1.5-7.5" />
                    </svg>
                  }
                />
                <Stat
                  label="Acesso 24hrs"
                  value="Sim"
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  }
                />
              </div>
            </div>
          ) : null}

          {tab === "conteudo" ? (
            <ol className="mt-6 space-y-2">
              {props.lessons.length === 0 ? (
                <p className="text-sm text-white/45">Conteúdo em breve.</p>
              ) : (
                props.lessons.map((lesson, i) => (
                  <li key={lesson.id} className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm">
                    <span className="text-white/35">{String(i + 1).padStart(2, "0")} · </span>
                    {lesson.title}
                  </li>
                ))
              )}
            </ol>
          ) : null}

          {tab === "prereq" ? (
            <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-white/60">
              {props.prerequisites || "Nenhum pré-requisito informado."}
            </p>
          ) : null}
        </div>

        <aside className="overflow-hidden rounded-2xl border border-white/8 bg-[#101018] lg:sticky lg:top-6">
          {props.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={props.coverUrl} alt="" className="h-44 w-full object-cover" />
          ) : (
            <div className="grid h-44 place-items-center bg-gradient-to-br from-[#1e3a5f] to-[#312e81] px-4 text-center font-semibold">
              {props.title}
            </div>
          )}
          <div className="p-5">
            <p className="mb-3 text-lg font-semibold">{formatBRL(props.price)}</p>
            {status === "PENDENTE" ? (
              <p className="rounded-xl bg-white/5 px-4 py-3 text-center text-sm text-white/70">
                Matrícula solicitada. Aguarde a liberação.
              </p>
            ) : (
              <button
                type="button"
                disabled={pending}
                onClick={startJourney}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#a855f7] py-3 text-sm font-semibold hover:bg-[#c084fc] disabled:opacity-60"
              >
                {pending ? "Enviando..." : "Começar Jornada Agora →"}
              </button>
            )}
            <p className="mt-3 text-center text-[11px] text-white/35">
              Acesso liberado após confirmação da matrícula.
            </p>
            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="font-semibold">Por que este curso?</p>
                <p className="mt-1 text-xs text-white/45">Tudo o que você precisa para dominar o assunto</p>
              </div>
              <div className="flex gap-3">
                <span className="mt-0.5 text-[#a855f7]">🏆</span>
                <div>
                  <p className="font-medium">Certificado de conclusão</p>
                  <p className="text-xs text-white/45">Receba um certificado ao finalizar o curso</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="mt-0.5 text-[#a855f7]">👁</span>
                <div>
                  <p className="font-medium">Acesso vitalício</p>
                  <p className="text-xs text-white/45">Estude no seu ritmo, sem prazo de expiração</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="mt-0.5 text-[#a855f7]">🎓</span>
                <div>
                  <p className="font-medium">Conteúdo atualizado</p>
                  <p className="text-xs text-white/45">Material revisado e sempre atualizado</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
