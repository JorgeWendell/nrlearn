"use client";

import { useActionState, useState, type FormEvent } from "react";
import { addAssessment, addQuestion } from "@/lib/actions/teacher";
import { toActionState, type ActionState } from "@/lib/form-state";

const CHUNK_BYTES = 4 * 1024 * 1024;
const MAX_COVER_BYTES = 20 * 1024 * 1024;

type UploadResult = { ok?: boolean; error?: string; id?: string };

function postForm(
  url: string,
  body: FormData,
  onProgress?: (loaded: number, total: number) => void,
) {
  return new Promise<UploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.timeout = 10 * 60 * 1000;
    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable || event.total <= 0) return;
        onProgress(event.loaded, event.total);
      };
    }
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText) as UploadResult;
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
    xhr.send(body);
  });
}

async function uploadFileInChunks(
  file: File,
  chunkUrl: string,
  onProgress: (percent: number, loaded: number, total: number) => void,
) {
  const uploadId = crypto.randomUUID();
  const totalChunks = Math.ceil(file.size / CHUNK_BYTES);
  for (let index = 0; index < totalChunks; index += 1) {
    const start = index * CHUNK_BYTES;
    const blob = file.slice(start, start + CHUNK_BYTES);
    const chunk = new FormData();
    chunk.set("uploadId", uploadId);
    chunk.set("index", String(index));
    chunk.set("total", String(totalChunks));
    chunk.set("filename", file.name);
    chunk.set("chunk", blob, file.name);
    const result = await postForm(chunkUrl, chunk, (loaded, total) => {
      const sent = start + loaded;
      const overall = Math.min(file.size, total > 0 ? sent : start);
      onProgress(Math.min(99, Math.round((overall / file.size) * 100)), overall, file.size);
    });
    if (result.error) return { error: result.error };
  }
  onProgress(99, file.size, file.size);
  return { uploadId };
}

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
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [loadedBytes, setLoadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    setProgress(null);
    setLoadedBytes(0);
    setTotalBytes(0);
    try {
      const form = event.currentTarget;
      const fileInput = form.querySelector<HTMLInputElement>('input[name="cover"]');
      const file = fileInput?.files?.[0];
      if (file && file.size > MAX_COVER_BYTES) {
        setError("A capa deve ter no máximo 20 MB.");
        setPending(false);
        return;
      }

      const body = new FormData(form);
      body.delete("cover");

      if (file) {
        setTotalBytes(file.size);
        setProgress(0);
        const uploaded = await uploadFileInChunks(file, "/api/docente/covers/chunk", (percent, loaded, total) => {
          setProgress(percent);
          setLoadedBytes(loaded);
          setTotalBytes(total);
        });
        if ("error" in uploaded && uploaded.error) {
          setError(uploaded.error);
          return;
        }
        if ("uploadId" in uploaded && uploaded.uploadId) {
          body.set("coverUploadId", uploaded.uploadId);
          body.set("coverName", file.name);
        }
      }

      const data = await postForm("/api/docente/courses", body);
      if (data.error) {
        setError(data.error);
        return;
      }
      if (!course && data.id) {
        window.location.href = `/docente/cursos/${data.id}`;
        return;
      }
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error && err.message === "timeout"
          ? "O envio demorou demais. Tente novamente."
          : "Falha de rede ao enviar a capa.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
        Capa (JPG, PNG, WEBP ou GIF, até 20 MB)
        <input
          name="cover"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
          className="mt-1 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-sm file:text-white"
        />
      </label>
      {course?.coverUrl ? (
        <div className="overflow-hidden rounded-xl border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={course.coverUrl} alt="Capa atual" className="h-40 w-full object-cover" />
        </div>
      ) : null}
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
      {error ? <p className="text-sm text-ember">{error}</p> : null}
      <div className="flex flex-wrap items-center gap-3">
        <button disabled={pending} className="btn btn-navy">
          {pending
            ? progress !== null && progress < 100
              ? `Enviando capa... ${progress}%`
              : "Salvando..."
            : course
              ? "Salvar curso"
              : "Criar curso"}
        </button>
        {pending && totalBytes > 0 ? (
          <span className="text-sm text-white/60">
            {formatMb(loadedBytes)} de {formatMb(totalBytes)}
          </span>
        ) : null}
      </div>
      {pending && progress !== null ? (
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#a855f7] transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}
    </form>
  );
}

async function uploadLesson(
  form: HTMLFormElement,
  file: File | undefined,
  onProgress: (percent: number, loaded: number, total: number) => void,
) {
  const body = new FormData(form);
  body.delete("material");

  if (!file) {
    return postForm("/api/docente/lessons", body);
  }

  const uploaded = await uploadFileInChunks(file, "/api/docente/lessons/chunk", onProgress);
  if ("error" in uploaded && uploaded.error) return { error: uploaded.error };
  if (!("uploadId" in uploaded) || !uploaded.uploadId) {
    return { error: "Falha ao enviar o arquivo." };
  }
  body.set("uploadId", uploaded.uploadId);
  body.set("materialName", file.name);
  return postForm("/api/docente/lessons", body);
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
      if (file) {
        setTotalBytes(file.size);
      }
      const data = await uploadLesson(form, file, (percent, loaded, total) => {
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
