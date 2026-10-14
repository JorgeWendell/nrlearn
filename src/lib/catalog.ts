import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { courses, lessons } from "@/db/schema";

export async function getFeaturedCourses() {
  "use cache";
  return db
    .select()
    .from(courses)
    .where(eq(courses.published, true))
    .orderBy(desc(courses.createdAt))
    .limit(3);
}

export async function getPublishedCourses() {
  "use cache";
  return db
    .select()
    .from(courses)
    .where(eq(courses.published, true))
    .orderBy(desc(courses.createdAt));
}

export async function getPublishedCourseBySlug(slug: string) {
  "use cache";
  const [course] = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  if (!course || !course.published) return null;

  const courseLessons = await db.select().from(lessons).where(eq(lessons.courseId, course.id));
  return { course, courseLessons };
}
