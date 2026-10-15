"use client";

import Link from "next/link";
import { useState } from "react";
import { LoginForm } from "@/components/login-form";
import { RegisterForm } from "@/components/register-form";

export function AlunoAccessTabs() {
  const [tab, setTab] = useState<"entrar" | "cadastro">("entrar");

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
      <div className="flex gap-6 border-b border-white/10">
        <button
          type="button"
          onClick={() => setTab("entrar")}
          className={`-mb-px border-b-2 pb-3 text-sm font-semibold ${
            tab === "entrar" ? "border-ember text-paper" : "border-transparent text-paper/45 hover:text-paper/80"
          }`}
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => setTab("cadastro")}
          className={`-mb-px border-b-2 pb-3 text-sm font-semibold ${
            tab === "cadastro" ? "border-ember text-paper" : "border-transparent text-paper/45 hover:text-paper/80"
          }`}
        >
          Primeiro acesso
        </button>
      </div>

      {tab === "entrar" ? (
        <div className="mt-6">
          <h2 className="font-serif text-2xl">Já sou aluno</h2>
          <p className="mt-2 text-sm text-paper/60">Acesse videoaulas, provas e seu progresso.</p>
          <div className="mt-6">
            <LoginForm portal="aluno" />
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="font-serif text-2xl">Criar conta</h2>
          <p className="mt-2 text-sm text-paper/60">Cadastro exclusivo para alunos.</p>
          <div className="mt-6">
            <RegisterForm />
          </div>
          <p className="mt-8 text-xs text-paper/45">
            Área docente e administrativa usam endereços próprios, fora do menu do site.
          </p>
          <p className="mt-2 hidden">
            <Link href="/docente/login">docente</Link>
          </p>
        </div>
      )}
    </div>
  );
}
