"use client";

import { deleteCourse } from "@/lib/actions/teacher";

export function DeleteCourseButton({ courseId, title }: { courseId: string; title: string }) {
  return (
    <form
      action={async () => {
        await deleteCourse(courseId);
      }}
      onSubmit={(event) => {
        if (
          !confirm(
            `Excluir o curso "${title}"? Aulas, materiais, provas e matrículas também serão removidos.`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <button type="submit" className="rounded-lg border border-ember/50 px-4 py-2 text-sm font-semibold text-ember hover:bg-ember/10">
        Excluir curso
      </button>
    </form>
  );
}
