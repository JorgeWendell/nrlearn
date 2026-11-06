"use client";

import { useActionState, useState, type FormEvent } from "react";
import { addAssessment, addQuestion, upsertCourse } from "@/lib/actions/teacher";
import { toActionState, type ActionState } from "@/lib/form-state";

export function CourseEditorForm({
  course,
}: {
  course?: {
    id: string;
    title: string;
    description: string;
    workloadHours: number;
    price: string;
    published: boolean;
    category?: string;
    level?: string;
    coverUrl?: string | null;
    featured?: boolean;
    prerequisites?: string | null;
  };
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionState, formData: FormData) => toActionState(await upsertCourse(formData)),
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      {course ? <input type="hidden" name="id" value={course.id} /> : null}
      <label className="block text-sm">
        Título
        <input
          name="title"
          required
          defaultValue={course?.title}
          className="mt-1"
        />
      </label>
      <label className="block text-sm">
        Descrição
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={course?.description}
          className="mt-1"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Carga horária
          <input
            name="workloadHours"
            type="number"
            min={1}
            defaultValue={course?.workloadHours ?? 8}
            className="mt-1"
          />
        </label>
        <label className="block text-sm">
          Preço (R$)
          <input
            name="price"
            type="number"
            min={0}
            step="0.01"
            defaultValue={course?.price ?? "0"}
            className="mt-1"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Categoria
          <input name="category" defaultValue={course?.category ?? "Geral"} className="mt-1" />
        </label>
        <label className="block text-sm">
          Nível
          <select name="level" defaultValue={course?.level ?? "Iniciante"} className="mt-1">
            <option>Iniciante</option>
            <option>Intermediário</option>
            <option>Avançado</option>
          </select>
        </label>
      </div>
      <label className="block text-sm">
        Capa (URL da imagem)
        <input name="coverUrl" defaultValue={course?.coverUrl ?? ""} className="mt-1" />
      </label>
      <label className="block text-sm">
        Pré-requisitos
        <textarea
          name="prerequisites"
          rows={3}
          defaultValue={course?.prerequisites ?? ""}
          className="mt-1"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input name="published" type="checkbox" defaultChecked={course?.published} />
        Publicar no catálogo
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input name="featured" type="checkbox" defaultChecked={course?.featured} />
        Destacar no topo da área do aluno
      </label>
      {state?.error ? <p className="text-sm text-ember">{state.error}</p> : null}
      {state?.ok ? <p className="text-sm text-navy">Curso salvo.</p> : null}
      <button
        disabled={pending}
        className="btn btn-navy"
      >
        {pending ? "Salvando..." : course ? "Salvar curso" : "Criar curso"}
      </button>
    </form>
  );
}

function uploadLesson(
  form: HTMLFormElement,
  onProgress: (percent: number, loaded: number, total: number) => void,
) {
  return new Promise<{ ok?: boolean; error?: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/docente/lessons");
    xhr.timeout = 15 * 60 * 1000;
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || event.total <= 0) return;
      onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)), event.loaded, event.total);
    };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText) as { ok?: boolean; error?: string };
        if (xhr.status >= 400) {
          resolve({ error: data.error ?? `Falha no envio (${xhr.status}).` });
          return;
        }
        resolve(data);
      } catch {
        resolve({ error: `Falha no envio (${xhr.status}).` });
      }
    };
    xhr.onerror = () => reject(new Error("network"));
    xhr.ontimeout = () => reject(new Error("timeout"));
    xhr.send(new FormData(form));
  });
}

function formatMb(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(bytes >= 100 * 1024 * 1024 ? 0 : 1)} MB`;
}

export function LessonEditorForm({ courseId, nextOrder }: { courseId: string; nextOrder: number }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [loadedBytes, setLoadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    setProgress(0);
    setLoadedBytes(0);
    setTotalBytes(0);
    try {
      const form = event.currentTarget;
      const fileInput = form.querySelector<HTMLInputElement>('input[name="material"]');
      const file = fileInput?.files?.[0];
      if (file && file.size > 250 * 1024 * 1024) {
        setError("O arquivo deve ter no máximo 250 MB.");
        setPending(false);
        setProgress(null);
        return;
      }
      const data = await uploadLesson(form, (percent, loaded, total) => {
        setProgress(percent);
        setLoadedBytes(loaded);
        setTotalBytes(total);
      });
      if (data?.error) {
        setError(data.error);
        return;
      }
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error && err.message === "timeout"
          ? "O envio demorou demais. Tente novamente."
          : "Falha de rede ao enviar o arquivo.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="courseId" value={courseId} />
      <label className="block text-sm">
        Módulo
        <input name="moduleName" defaultValue="Módulo 1" className="mt-1" />
      </label>
      <label className="block text-sm">
        Título da aula
        <input
          name="title"
          required
          className="mt-1"
        />
      </label>
      <label className="block text-sm">
        URL do vídeo (YouTube ou Vimeo)
        <input name="videoUrl" className="mt-1" />
      </label>
      <label className="block text-sm">
        Material (PDF, PPT ou PPTX, até 250 MB)
        <input
          name="material"
          type="file"
          accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          className="mt-1 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-sm file:text-white"
        />
      </label>
      <label className="block text-sm">
        Ordem
        <input
          name="order"
          type="number"
          min={1}
          defaultValue={nextOrder}
          className="mt-1"
        />
      </label>
      {error ? <p className="text-sm text-ember">{error}</p> : null}
      <div className="flex flex-wrap items-center gap-3">
        <button disabled={pending} className="btn btn-primary">
          {pending
            ? progress !== null && progress < 100
              ? `Adicionando... ${progress}%`
              : "Adicionando... processando"
            : "Adicionar aula"}
        </button>
        {pending && totalBytes > 0 ? (
          <span className="text-sm text-white/60">
            {formatMb(loadedBytes)} de {formatMb(totalBytes)}
          </span>
        ) : null}
      </div>
      {pending ? (
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#a855f7] transition-[width] duration-150"
            style={{ width: `${progress ?? 0}%` }}
          />
        </div>
      ) : null}
    </form>
  );
}

export function AssessmentEditorForm({ courseId }: { courseId: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionState, formData: FormData) => toActionState(await addAssessment(formData)),
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="courseId" value={courseId} />
      <label className="block text-sm">
        Título
        <input
          name="title"
          required
          className="mt-1"
        />
      </label>
      <label className="block text-sm">
        Tipo
        <select name="type" className="mt-1">
          <option value="PROVA">Prova (2 tentativas)</option>
          <option value="QUIZ">Quiz</option>
        </select>
      </label>
      <label className="block text-sm">
        Ordem
        <input
          name="order"
          type="number"
          min={0}
          defaultValue={0}
          className="mt-1"
        />
      </label>
      {state?.error ? <p className="text-sm text-ember">{state.error}</p> : null}
      <button
        disabled={pending}
        className="btn btn-primary"
      >
        {pending ? "Criando..." : "Criar avaliação"}
      </button>
    </form>
  );
}

export function QuestionEditorForm({
  courseId,
  assessmentId,
}: {
  courseId: string;
  assessmentId: string;
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionState, formData: FormData) => toActionState(await addQuestion(formData)),
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="assessmentId" value={assessmentId} />
      <label className="block text-sm">
        Enunciado
        <textarea
          name="prompt"
          required
          rows={3}
          className="mt-1"
        />
      </label>
      {[1, 2, 3, 4].map((n) => (
        <label key={n} className="block text-sm">
          Alternativa {n}
          <input
            name={`option${n}`}
            required
            className="mt-1"
          />
        </label>
      ))}
      <label className="block text-sm">
        Alternativa correta
        <select name="correct" defaultValue="1" className="mt-1">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </label>
      {state?.error ? <p className="text-sm text-ember">{state.error}</p> : null}
      <button
        disabled={pending}
        className="btn btn-navy"
      >
        {pending ? "Incluindo..." : "Incluir questão"}
      </button>
    </form>
  );
}
