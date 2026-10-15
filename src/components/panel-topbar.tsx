"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/lib/actions/auth";

export function PanelTopbar({
  name,
  email,
  roleLabel,
  manageHref,
}: {
  name: string;
  email: string;
  roleLabel: string;
  manageHref?: string;
}) {
  const initial = (name.trim()[0] ?? "A").toUpperCase();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="flex items-center justify-between gap-4 border-b border-white/5 px-5 py-3 md:px-8">
      <p className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
        Você está como: <span className="font-semibold text-white">{roleLabel}</span>
      </p>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-2.5 rounded-full py-0.5 pl-1 pr-1"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <span className="hidden text-sm text-white/80 sm:inline">{name}</span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#7c3aed] text-sm font-semibold">
            {initial}
          </span>
        </button>
        {open ? (
          <div
            role="menu"
            className="absolute right-0 z-50 mt-3 w-64 rounded-xl border border-white/10 bg-black/35 p-2 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center gap-3 px-2 py-2">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#7c3aed] text-sm font-semibold">
                {initial}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{name}</p>
                <p className="truncate text-xs text-white/50">{email}</p>
              </div>
            </div>
            {manageHref ? (
              <Link
                href={manageHref}
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-white/80 hover:bg-white/5"
              >
                <svg className="h-4 w-4 text-white/45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
                </svg>
                Gerenciar conta
              </Link>
            ) : null}
            <form action={logoutAction}>
              <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-white/80 hover:bg-white/5">
                <svg className="h-4 w-4 text-white/45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M10 6H5v12h5M10 12h10M16 8l4 4-4 4" />
                </svg>
                Sair
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </header>
  );
}
