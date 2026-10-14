"use client";

import { useActionState } from "react";
import { addAssessment, addLesson, addQuestion, upsertCourse } from "@/lib/actions/teacher";

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
  };
}) {
  async function action(_: { error?: string; ok?: boolean } | null, formData: FormData) {
    return upsertCourse(formData);
  }
  const [state, formAction, pending] = useActionState(action, null);

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
      <label className="flex items-center gap-2 text-sm">
        <input name="published" type="checkbox" defaultChecked={course?.published} />
        Publicar no catálogo
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

export function LessonEditorForm({ courseId, nextOrder }: { courseId: string; nextOrder: number }) {
  async function action(_: { error?: string; ok?: boolean } | null, formData: FormData) {
    return addLesson(formData);
  }
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="courseId" value={courseId} />
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
        <input
          name="videoUrl"
          required
          className="mt-1"
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
      {state?.error ? <p className="text-sm text-ember">{state.error}</p> : null}
      <button
        disabled={pending}
        className="btn btn-primary"
      >
        {pending ? "Adicionando..." : "Adicionar aula"}
      </button>
    </form>
  );
}

export function AssessmentEditorForm({ courseId }: { courseId: string }) {
  async function action(_: { error?: string; ok?: boolean } | null, formData: FormData) {
    return addAssessment(formData);
  }
  const [state, formAction, pending] = useActionState(action, null);

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
  async function action(_: { error?: string; ok?: boolean } | null, formData: FormData) {
    return addQuestion(formData);
  }
  const [state, formAction, pending] = useActionState(action, null);

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
