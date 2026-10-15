import { PanelTopbar } from "@/components/panel-topbar";

export function AlunoTopbar({ name, email }: { name: string; email: string }) {
  return <PanelTopbar name={name} email={email} roleLabel="Aluno" manageHref="/aluno/curriculo" />;
}
