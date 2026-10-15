import type { ReactNode } from "react";
import { AlunoPageHeader } from "@/components/aluno-page-header";

export function DocenteShell({
  kicker = "Área docente",
  title,
  children,
}: {
  kicker?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <AlunoPageHeader crumbs={["Início", kicker]} title={title} />
      {children}
    </div>
  );
}
