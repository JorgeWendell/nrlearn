export function isLessonUnlocked(
  orderedLessons: { id: string }[],
  completedIds: Set<string>,
  lessonId: string,
) {
  const index = orderedLessons.findIndex((lesson) => lesson.id === lessonId);
  if (index <= 0) return true;
  return completedIds.has(orderedLessons[index - 1].id);
}
