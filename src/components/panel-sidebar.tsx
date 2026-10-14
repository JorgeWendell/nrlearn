"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";

export type PanelNavItem = {
  href: string;
  label: string;
  isActive?: (pathname: string) => boolean;
};

export function PanelSidebar({
  kicker,
  title,
  userName,
  dashboardHref,
  groups,
}: {
  kicker: string;
  title: string;
  userName: string;
  dashboardHref: string;
  groups: { label: string; items: PanelNavItem[] }[];
}) {
  const pathname = usePathname();

  function itemClass(active: boolean) {
    return `rounded-xl px-3 py-2 ${
      active ? "bg-white/15 text-white" : "text-paper/70 hover:bg-white/10 hover:text-white"
    }`;
  }

  return (
    <aside className="flex w-full flex-col bg-navy text-paper md:min-h-screen md:w-64">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">{kicker}</p>
        <p className="mt-1 font-serif text-xl">{title}</p>
        <p className="mt-1 truncate text-sm text-paper/60">{userName}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4 text-sm">
        <Link href={dashboardHref} className={itemClass(pathname === dashboardHref)}>
          Dashboard
        </Link>
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mt-4 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/80">
              {group.label}
            </p>
            {group.items.map((item) => {
              const active = item.isActive ? item.isActive(pathname) : pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={itemClass(active)}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 px-4 py-4">
        <LogoutButton />
      </div>
    </aside>
  );
}
