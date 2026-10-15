import type { ReactNode } from "react";

export function AlunoPageHeader({
  crumbs,
  title,
  subtitle,
  icon,
}: {
  crumbs: string[];
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="mb-6">
      <p className="text-xs text-white/40">
        {crumbs.map((crumb, i) => (
          <span key={`${crumb}-${i}`}>
            {i > 0 ? <span className="px-1.5 text-white/25">/</span> : null}
            <span className={i === crumbs.length - 1 ? "text-white/70" : ""}>{crumb}</span>
          </span>
        ))}
      </p>
      <div className="mt-4 flex items-start gap-3">
        {icon ? (
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 text-white/70">
            {icon}
          </span>
        ) : null}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-white/45">{subtitle}</p> : null}
        </div>
      </div>
    </div>
  );
}
