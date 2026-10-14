"use client";

import { useActionState } from "react";
import { submitAssessment } from "@/lib/actions/assessment";

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
}: {
  assessmentId: string;
  type: "PROVA" | "QUIZ";
  questions: Question[];
  attemptsUsed: number;
  lastScore: number | null;
  showGabarito: boolean;
}) {
  const max = type === "PROVA" ? 2 : Number.POSITIVE_INFINITY;
  const canTry = attemptsUsed < max;

  async function action(_: { error?: string; score?: number } | null, formData: FormData) {
    return submitAssessment(assessmentId, formData);
  }
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <div className="space-y-6">
      {type === "PROVA" ? (
        <p className="text-sm text-muted">
          Tentativas: {attemptsUsed}/2
          {lastScore != null ? ` · Última nota: ${lastScore}%` : ""}
        </p>
      ) : (
        <p className="text-sm text-muted">
          Quiz de prática — tentativas ilimitadas
          {lastScore != null ? ` · Último resultado: ${lastScore}%` : ""}
        </p>
      )}

      {state?.error ? <p className="text-ember">{state.error}</p> : null}
      {state?.ok ? <p className="text-emerald-800">Enviado. Nota: {state.score}%</p> : null}

      {showGabarito ? (
        <div className="card space-y-6 p-6">
          <h2 className="font-serif text-2xl">Gabarito</h2>
          {questions.map((q, i) => (
            <div key={q.id}>
              <p className="font-medium">
                {i + 1}. {q.prompt}
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {q.options.map((o) => (
                  <li key={o.id} className={o.isCorrect ? "font-semibold text-emerald-800" : ""}>
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
            <fieldset key={q.id} className="card p-5">
              <legend className="px-1 font-medium">
                {i + 1}. {q.prompt}
              </legend>
              <div className="mt-3 space-y-2">
                {q.options.map((o) => (
                  <label key={o.id} className="flex cursor-pointer gap-2 text-sm">
                    <input type="radio" name={`q-${q.id}`} value={o.id} required />
                    {o.text}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <button
            disabled={pending}
            className="btn btn-primary"
          >
            {pending ? "Enviando..." : "Finalizar"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
