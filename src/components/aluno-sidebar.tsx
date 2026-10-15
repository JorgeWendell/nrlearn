"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const groups = [
  {
    label: "Geral",
    items: [{ href: "/aluno", label: "Dashboard", icon: "home" }],
  },
  {
    label: "Acadêmico",
    items: [{ href: "/aluno/curriculo", label: "Currículo", icon: "book" }],
  },
  {
    label: "Estudos",
    items: [
      { href: "/aluno/cursos", label: "Cursos", icon: "play" },
      { href: "/aluno/artigos", label: "Artigos", icon: "file" },
      { href: "/aluno/desafios", label: "Desafios", icon: "flag" },
    ],
  },
];

function Icon({ name }: { name: string }) {
  const common = "h-4 w-4 shrink-0";
  if (name === "home") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
      </svg>
    );
  }
  if (name === "book") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21.5V5.5Z" />
        <path d="M5 19.5A2.5 2.5 0 0 1 7.5 17H19" />
      </svg>
    );
  }
  if (name === "play") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="m10 9 6 4-6 4V9Z" />
      </svg>
    );
  }
  if (name === "file") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 3h7l5 5v13H7V3Z" />
        <path d="M14 3v5h5" />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 4h10l2 4H8L6 4Z" />
      <path d="M8 8v12l4-3 4 3V8" />
    </svg>
  );
}

export function AlunoSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-white/5 bg-[#081018] md:min-h-screen md:w-60 md:border-b-0 md:border-r">
      <Link href="/aluno" className="flex items-center justify-center px-4 py-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/treina.png" alt="Treina" className="h-44 w-full max-w-[220px] object-contain" />
      </Link>
      <nav className="flex-1 px-3 pb-6">
        {groups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active =
                  item.href === "/aluno"
                    ? pathname === "/aluno"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${
                      active
                        ? "bg-[#6d28d9] text-white"
                        : "text-white/65 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon name={item.icon} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
