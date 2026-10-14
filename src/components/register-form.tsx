"use client";

import { useActionState } from "react";
import { registerAlunoAction } from "@/lib/actions/auth";

export function RegisterForm() {
  async function action(_: { error?: string } | null, formData: FormData) {
    return registerAlunoAction(formData);
  }
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm">
        Nome completo
        <input
          name="name"
          required
          className="mt-1"
        />
      </label>
      <label className="block text-sm">
        Email
        <input
          name="email"
          type="email"
          required
          className="mt-1"
        />
      </label>
      <label className="block text-sm">
        Senha
        <input
          name="password"
          type="password"
          minLength={6}
          required
          className="mt-1"
        />
      </label>
      {state?.error ? <p className="text-sm text-ember">{state.error}</p> : null}
      <button
        disabled={pending}
        className="btn btn-navy w-full"
      >
        {pending ? "Criando..." : "Criar conta"}
      </button>
    </form>
  );
}
