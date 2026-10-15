"use client";

import { useState, useTransition } from "react";
import { updateProfileNotify, updateProfileText, type StudentProfileData } from "@/lib/actions/profile";

function Pencil() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20h4l11-11-4-4L4 16v4Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function firstName(name: string) {
  const raw = name.trim().split(/\s+/)[0] || name;
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function toHref(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function ConnectionLink({
  label,
  displayName,
  value,
  onSave,
}: {
  label: "Linkedin" | "GitHub";
  displayName: string;
  value: string;
  onSave: (next: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function start() {
    setDraft(value);
    setEditing(true);
  }

  function save() {
    setEditing(false);
    if (draft.trim() !== value) onSave(draft.trim());
  }

  if (editing) {
    return (
      <input
        autoFocus
        className="w-full rounded-md border border-white/15 bg-[#0b1220] px-2 py-1 text-sm text-white outline-none focus:border-[#8b5cf6]"
        placeholder={
          label === "Linkedin"
            ? "https://www.linkedin.com/in/seu-perfil"
            : "https://github.com/seu-usuario"
        }
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") setEditing(false);
        }}
      />
    );
  }

  if (!value) {
    return (
      <button
        type="button"
        onClick={start}
        className="group flex min-h-6 w-full items-center gap-2 text-left text-sm text-white/45 hover:text-white/80"
      >
        <span className="min-w-0 flex-1">--</span>
        <span className="text-white/30 group-hover:text-white/70">
          <Pencil />
        </span>
      </button>
    );
  }

  return (
    <div className="flex min-h-6 w-full items-center gap-2 text-sm">
      <a
        href={toHref(value)}
        target="_blank"
        rel="noopener noreferrer"
        className="min-w-0 flex-1 truncate text-white/80 hover:text-white hover:underline"
      >
        {label}/{firstName(displayName)}
      </a>
      <button
        type="button"
        onClick={start}
        className="shrink-0 text-white/30 hover:text-white/70"
        aria-label={`Editar ${label}`}
      >
        <Pencil />
      </button>
    </div>
  );
}

function EditableValue({
  value,
  placeholder = "--",
  onSave,
}: {
  value: string;
  placeholder?: string;
  onSave: (next: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function start() {
    setDraft(value);
    setEditing(true);
  }

  function save() {
    setEditing(false);
    if (draft.trim() !== value) onSave(draft);
  }

  if (editing) {
    return (
      <input
        autoFocus
        className="w-full rounded-md border border-white/15 bg-[#0b1220] px-2 py-1 text-sm text-white outline-none focus:border-[#8b5cf6]"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") setEditing(false);
        }}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={start}
      className="group flex min-h-6 w-full items-start gap-2 text-left text-sm text-white/45 hover:text-white/80"
    >
      <span className={`min-w-0 flex-1 truncate ${value ? "text-white/80" : ""}`}>
        {value || placeholder}
      </span>
      <span className="mt-0.5 shrink-0 text-white/30 group-hover:text-white/70">
        <Pencil />
      </span>
    </button>
  );
}

function AboutMeEditor({
  value,
  onSave,
}: {
  value: string;
  onSave: (next: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function start() {
    setDraft(value);
    setEditing(true);
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  function save() {
    onSave(draft);
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={start}
        className="group flex min-h-[4.5rem] w-full items-start gap-2 text-left text-sm text-white/45 hover:text-white/80"
      >
        <span className={`min-w-0 flex-1 whitespace-pre-wrap ${value ? "text-white/80" : ""}`}>
          {value || "Clique para escrever sobre você"}
        </span>
        <span className="mt-0.5 shrink-0 text-white/30 group-hover:text-white/70">
          <Pencil />
        </span>
      </button>
    );
  }

  return (
    <div>
      <textarea
        autoFocus
        rows={5}
        className="w-full rounded-md border border-white/15 bg-[#0b1220] px-3 py-2 text-sm text-white outline-none focus:border-[#8b5cf6]"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") cancel();
        }}
      />
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={cancel}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={save}
          className="rounded-lg bg-[#6d28d9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7c3aed]"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}

export function CurriculoProfile({
  name,
  profile,
}: {
  name: string;
  profile: StudentProfileData;
}) {
  const [data, setData] = useState(profile);
  const [, startTransition] = useTransition();
  const initial = (name.trim()[0] ?? "A").toUpperCase();

  function saveText(field: keyof StudentProfileData, value: string) {
    const next =
      field === "linkedin" || field === "github" || field === "website"
        ? toHref(value)
        : value;
    setData((prev) => ({ ...prev, [field]: next }));
    startTransition(() => {
      void updateProfileText(field, value);
    });
  }

  function toggleNotify() {
    const next = !data.notifyUpdates;
    setData((prev) => ({ ...prev, notifyUpdates: next }));
    startTransition(() => {
      void updateProfileNotify(next);
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="space-y-4">
        <section className="overflow-hidden rounded-2xl border border-white/6 bg-[#101826]">
          <div className="relative h-36 overflow-hidden md:h-40">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 120% at 20% 40%, #60a5fa 0%, transparent 55%), radial-gradient(ellipse 70% 100% at 70% 20%, #3b82f6 0%, transparent 50%), radial-gradient(ellipse 50% 80% at 90% 80%, #1d4ed8 0%, transparent 50%), linear-gradient(105deg, #2563eb 0%, #38bdf8 55%, #1e40af 100%)",
              }}
            />
            <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 800 160" preserveAspectRatio="none">
              <circle cx="80" cy="40" r="3" fill="white" opacity="0.5" />
              <circle cx="110" cy="70" r="2" fill="white" opacity="0.35" />
              <circle cx="50" cy="90" r="2.5" fill="white" opacity="0.4" />
              <circle cx="140" cy="30" r="2" fill="white" opacity="0.3" />
              <path d="M420 20c40 20 70 70 40 120" fill="none" stroke="white" strokeWidth="1.2" opacity="0.25" />
              <path d="M520 0c20 40 10 90 60 140" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
              <polygon points="680,20 700,20 690,38" fill="none" stroke="white" strokeWidth="1" opacity="0.25" />
              <polygon points="720,50 745,50 732,72" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
            </svg>
          </div>
          <div className="relative px-5 pb-6 pt-8 md:px-7">
            <div className="absolute -top-8 left-6 grid h-16 w-16 place-items-center rounded-full bg-[#7c3aed] text-2xl font-semibold text-white ring-4 ring-[#101826] md:left-7">
              {initial}
            </div>
            <div className="ml-[4.5rem] md:ml-20">
              <p className="text-lg font-semibold">{name}</p>
              <div className="mt-2 max-w-sm space-y-1">
                <EditableValue
                  value={data.headline}
                  onSave={(v) => saveText("headline", v)}
                />
                <EditableValue
                  value={data.company}
                  onSave={(v) => saveText("company", v)}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/6 bg-[#101826] p-5">
          <h2 className="mb-3 text-sm font-semibold">Sobre mim</h2>
          <div className="rounded-xl border border-white/8 bg-[#0b1220]/50 p-3">
            <AboutMeEditor value={data.about} onSave={(v) => saveText("about", v)} />
          </div>
        </section>
      </div>

      <aside className="space-y-4">
        <section className="rounded-2xl border border-white/6 bg-[#101826] p-4">
          <h2 className="mb-3 text-sm font-semibold">Localização</h2>
          <div className="flex items-start gap-2 text-white/50">
            <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.2" />
            </svg>
            <EditableValue value={data.location} onSave={(v) => saveText("location", v)} />
          </div>
        </section>

        <section className="rounded-2xl border border-white/6 bg-[#101826] p-4">
          <h2 className="mb-3 text-sm font-semibold">Conexões</h2>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2 text-white/50">
              <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c3 4 3 14 0 18M12 3c-3 4-3 14 0 18" />
              </svg>
              <EditableValue value={data.website} onSave={(v) => saveText("website", v)} />
            </div>
            <div className="flex items-start gap-2 text-white/50">
              <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.5 3.5h3.2v3.1H4.5V3.5Zm.1 4.3h3V20.5h-3V7.8Zm5 0h2.9v1.7h.04c.4-.8 1.4-1.9 3-1.9 3.2 0 3.8 2.1 3.8 4.8v8.1h-3v-7.2c0-1.7 0-3.9-2.4-3.9s-2.7 1.8-2.7 3.8v7.3h-3V7.8Z" />
              </svg>
              <ConnectionLink
                label="Linkedin"
                displayName={name}
                value={data.linkedin}
                onSave={(v) => saveText("linkedin", v)}
              />
            </div>
            <div className="flex items-start gap-2 text-white/50">
              <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.2c-5.5 0-10 4.5-10 10 0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c2-.1 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7 1 .7 2v2.2c0 .3.2.6.7.5 4-1.3 6.8-5.1 6.8-9.5 0-5.5-4.5-10-10-10Z" />
              </svg>
              <ConnectionLink
                label="GitHub"
                displayName={name}
                value={data.github}
                onSave={(v) => saveText("github", v)}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/6 bg-[#101826] p-4">
          <h2 className="mb-3 text-sm font-semibold">Notificações</h2>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-white/50">Receber novidades e atualizações?</p>
            <button
              type="button"
              role="switch"
              aria-checked={data.notifyUpdates}
              onClick={toggleNotify}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                data.notifyUpdates ? "bg-[#ec4899]" : "bg-white/20"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                  data.notifyUpdates ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </section>
      </aside>
    </div>
  );
}
