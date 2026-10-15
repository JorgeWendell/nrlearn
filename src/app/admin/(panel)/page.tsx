import { AlunoPageHeader } from "@/components/aluno-page-header";
import { getAdminMetrics } from "@/lib/admin-metrics";
import { formatBRL } from "@/lib/format";
import { requireAdmin } from "@/lib/session";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const metrics = await getAdminMetrics();
  const maxCourse = Math.max(...metrics.perCourse.map((c) => c.total), 1);
  const maxMonth = Math.max(...metrics.monthly.map((m) => m.total), 1);

  const kpis = [
    { label: "Alunos cadastrados", value: String(metrics.alunosCadastrados) },
    { label: "Alunos com curso em andamento", value: String(metrics.alunosEmAndamento) },
    { label: "Faturamento do mês", value: formatBRL(metrics.monthRevenue) },
    { label: "Faturamento total", value: formatBRL(metrics.totalRevenue) },
  ];

  return (
    <div>
      <AlunoPageHeader crumbs={["Início", "Dashboard"]} title={`Olá, ${admin.name}`} />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{kpi.label}</p>
            <p className="display mt-3 text-3xl text-navy">{kpi.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="card p-6">
          <h2 className="font-serif text-2xl">Faturamento por curso</h2>
          <p className="mt-1 text-sm text-muted">Soma das matrículas liberadas.</p>
          <ul className="mt-5 space-y-4">
            {metrics.perCourse.length === 0 ? (
              <li className="text-sm text-muted">Nenhum curso cadastrado.</li>
            ) : (
              metrics.perCourse.map((course) => (
                <li key={course.id}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">{course.title}</span>
                    <span className="shrink-0 text-navy">{formatBRL(course.total)}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-navy/10">
                    <div
                      className="h-full rounded-full bg-ember"
                      style={{ width: `${Math.max(4, (course.total / maxCourse) * 100)}%` }}
                    />
                  </div>
                </li>
              ))
            )}
          </ul>
        </article>

        <article className="card p-6">
          <h2 className="font-serif text-2xl">Faturamento mensal</h2>
          <p className="mt-1 text-sm text-muted">Últimos 12 meses.</p>
          <ul className="mt-5 space-y-3">
            {metrics.monthly.map((month) => (
              <li key={month.label} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 text-sm">
                <span className={month.isCurrent ? "font-semibold capitalize text-navy" : "capitalize text-muted"}>
                  {month.label}
                </span>
                <div className="h-2 overflow-hidden rounded-full bg-navy/10">
                  <div
                    className={`h-full rounded-full ${month.isCurrent ? "bg-ember" : "bg-navy"}`}
                    style={{ width: `${Math.max(month.total > 0 ? 4 : 0, (month.total / maxMonth) * 100)}%` }}
                  />
                </div>
                <span className="shrink-0">{formatBRL(month.total)}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
