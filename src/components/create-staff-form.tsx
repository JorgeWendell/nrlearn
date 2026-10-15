"use client";

import { useActionState } from "react";
import { createAdminAction, createProfessorAction } from "@/lib/actions/auth";
import { toActionState, type ActionState } from "@/lib/form-state";

export function CreateStaffForm({ role }: { role: "PROFESSOR" | "ADMIN" }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionState, formData: FormData) =>
      toActionState(
        await (role === "ADMIN" ? createAdminAction(formData) : createProfessorAction(formData)),
      ),
    null,
  );
  const isAdmin = role === "ADMIN";

  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm">
        Nome completo
        <input name="name" required className="mt-1" />
      </label>
      <label className="block text-sm">
        Email
        <input name="email" type="email" required className="mt-1" />
      </label>
      <label className="block text-sm">
        Senha inicial
        <input name="password" type="password" minLength={6} required className="mt-1" />
      </label>
      {state?.error ? <p className="text-sm text-ember">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-navy">{state.success}</p> : null}
      <button disabled={pending} className="btn btn-navy">
        {pending ? "Criando..." : isAdmin ? "Criar administrador" : "Criar professor"}
      </button>
    </form>
  );
}
