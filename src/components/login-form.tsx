"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import { toActionState, type ActionState } from "@/lib/form-state";

type Portal = "aluno" | "docente" | "admin";

export function LoginForm({ portal }: { portal: Portal }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionState, formData: FormData) => toActionState(await loginAction(formData)),
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="portal" value={portal} />
      <label className="block text-sm">
        Email
        <input name="email" type="email" required className="mt-1" />
      </label>
      <label className="block text-sm">
        Senha
        <input name="password" type="password" required className="mt-1" />
      </label>
      {state?.error ? <p className="text-sm text-ember">{state.error}</p> : null}
      <button disabled={pending} className="btn btn-primary w-full">
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
