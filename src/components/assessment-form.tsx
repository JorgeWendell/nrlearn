"use client";

import { useActionState } from "react";
import { submitAssessment } from "@/lib/actions/assessment";
import { toActionState, type ActionState } from "@/lib/form-state";

type Question = {
  id: string;
  prompt: string;
  options: { id: string; text: string; isCorrect: boolean }[];
};

export function AssessmentForm({
  assessmentId,
  type,
  questions,
  attemptsUsed,
  lastScore,
  showGabarito,
  canTry,
  windowLabel,
  unlockAt,
}: {
  assessmentId: string;
  type: "PROVA" | "QUIZ";
  questions: Question[];
  attemptsUsed: number;
  lastScore: number | null;
  showGabarito: boolean;
  canTry: boolean;
  windowLabel?: string;
  unlockAt?: string | null;
}) {

  const [state, formAction, pending] = useActionState(
    async (_prev: ActionState, formData: FormData) =>
      toActionState(await submitAssessment(assessmentId, formData)),
    null,
  );

  return (
    <div className="flex-1 space-y-6 rounded-2xl border border-white/10 bg-transparent p-6 backdrop-blur-sm md:p-10">
      {type === "PROVA" ? (
        <p className="text-sm text-white/50">
          Tentativas: {windowLabel ?? `${attemptsUsed}/2`}
          {lastScore != null ? ` · Última nota: ${lastScore}%` : ""}
          {unlockAt
            ? ` · Novas tentativas em ${new Date(unlockAt).toLocaleString("pt-BR")}`
            : ""}
        </p>
      ) : (
        <p className="text-sm text-white/50">
          Quiz de prática — tentativas ilimitadas
          {lastScore != null ? ` · Último resultado: ${lastScore}%` : ""}
        </p>
      )}

      {type === "PROVA" && unlockAt && !canTry ? (
        <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          Você usou as 2 tentativas iniciais. Após 24 horas serão liberadas mais 2 tentativas.
        </p>
      ) : null}

      {state?.error ? <p className="text-ember">{state.error}</p> : null}
      {state?.ok ? <p className="text-emerald-400">Enviado. Nota: {state.score}%</p> : null}

      {showGabarito ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Gabarito</h2>
          {questions.map((q, i) => (
            <div key={q.id}>
              <p className="font-medium">
                {i + 1}. {q.prompt}
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {q.options.map((o) => (
                  <li key={o.id} className={o.isCorrect ? "font-semibold text-emerald-400" : "text-white/70"}>
                    {o.isCorrect ? "✓ " : "• "}
                    {o.text}
                    {o.isCorrect ? " (correta)" : ""}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}

      {canTry && !showGabarito ? (
        <form action={formAction} className="space-y-8">
          {questions.map((q, i) => (
            <fieldset key={q.id} className="rounded-xl border border-white/10 bg-transparent p-6 md:p-8">
              <legend className="px-1 text-base font-medium text-white">
                {i + 1}. {q.prompt}
              </legend>
              <div className="mt-4 space-y-3">
                {q.options.map((o) => (
                  <label
                    key={o.id}
                    className="flex cursor-pointer items-start gap-3 text-sm font-normal text-white/80"
                  >
                    <input type="radio" name={`q-${q.id}`} value={o.id} required />
                    <span>{o.text}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <button
            disabled={pending}
            className="rounded-xl bg-[#a855f7] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c084fc] disabled:opacity-60"
          >
            {pending ? "Enviando..." : "Finalizar"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
