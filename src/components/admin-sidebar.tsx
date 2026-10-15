"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const groups = [
  {
    label: "Geral",
    items: [{ href: "/admin", label: "Dashboard", icon: "home" }],
  },
  {
    label: "Cadastros",
    items: [
      { href: "/admin/cadastros/professores", label: "Professor", icon: "user" },
      { href: "/admin/cadastros/admins", label: "Admin", icon: "shield" },
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
  if (name === "user") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 19c1.5-3 4-4.5 7-4.5S17.5 16 19 19" />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
    </svg>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-white/5 bg-[#081018] md:min-h-screen md:w-60 md:border-b-0 md:border-r">
      <Link href="/admin" className="flex items-center justify-center px-4 py-6">
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
                  item.href === "/admin"
                    ? pathname === "/admin"
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
