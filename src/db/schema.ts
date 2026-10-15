import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["ALUNO", "PROFESSOR", "ADMIN"]);
export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "PENDENTE",
  "ATIVA",
  "CONCLUIDA",
]);
export const assessmentTypeEnum = pgEnum("assessment_type", ["PROVA", "QUIZ"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("ALUNO"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const studentProfiles = pgTable("student_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  headline: text("headline"),
  company: text("company"),
  location: text("location"),
  website: text("website"),
  linkedin: text("linkedin"),
  github: text("github"),
  about: text("about"),
  notifyUpdates: boolean("notify_updates").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  workloadHours: integer("workload_hours").notNull().default(8),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  published: boolean("published").notNull().default(false),
  category: text("category").notNull().default("Geral"),
  level: text("level").notNull().default("Iniciante"),
  coverUrl: text("cover_url"),
  featured: boolean("featured").notNull().default(false),
  prerequisites: text("prerequisites"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const lessons = pgTable("lessons", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
  order: integer("order").notNull(),
  durationSeconds: integer("duration_seconds"),
  moduleName: text("module_name").notNull().default("Módulo 1"),
});

export const assessments = pgTable("assessments", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  lessonId: uuid("lesson_id").references(() => lessons.id, { onDelete: "set null" }),
  type: assessmentTypeEnum("type").notNull(),
  title: text("title").notNull(),
  order: integer("order").notNull().default(0),
});

export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  prompt: text("prompt").notNull(),
  order: integer("order").notNull(),
});

export const options = pgTable("options", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  isCorrect: boolean("is_correct").notNull().default(false),
});

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    status: enrollmentStatusEnum("status").notNull().default("PENDENTE"),
    requestedAt: timestamp("requested_at", { withTimezone: true }).defaultNow().notNull(),
    releasedAt: timestamp("released_at", { withTimezone: true }),
  },
  (table) => [uniqueIndex("enrollments_user_course_idx").on(table.userId, table.courseId)],
);

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("lesson_progress_user_lesson_idx").on(table.userId, table.lessonId)],
);

export const attempts = pgTable("attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  attemptNumber: integer("attempt_number").notNull(),
  score: integer("score").notNull().default(0),
  answers: text("answers").notNull().default("{}"),
  finishedAt: timestamp("finished_at", { withTimezone: true }).defaultNow().notNull(),
});

export const revenueEntries = pgTable("revenue_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  enrollmentId: uuid("enrollment_id")
    .notNull()
    .references(() => enrollments.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  enrollments: many(enrollments),
  progress: many(lessonProgress),
  attempts: many(attempts),
  studentProfile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.userId],
  }),
}));

export const studentProfilesRelations = relations(studentProfiles, ({ one }) => ({
  user: one(users, { fields: [studentProfiles.userId], references: [users.id] }),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  lessons: many(lessons),
  assessments: many(assessments),
  enrollments: many(enrollments),
  revenueEntries: many(revenueEntries),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  course: one(courses, { fields: [lessons.courseId], references: [courses.id] }),
  progress: many(lessonProgress),
  assessments: many(assessments),
}));

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  course: one(courses, { fields: [assessments.courseId], references: [courses.id] }),
  lesson: one(lessons, { fields: [assessments.lessonId], references: [lessons.id] }),
  questions: many(questions),
  attempts: many(attempts),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  assessment: one(assessments, {
    fields: [questions.assessmentId],
    references: [assessments.id],
  }),
  options: many(options),
}));

export const optionsRelations = relations(options, ({ one }) => ({
  question: one(questions, { fields: [options.questionId], references: [questions.id] }),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, { fields: [enrollments.userId], references: [users.id] }),
  course: one(courses, { fields: [enrollments.courseId], references: [courses.id] }),
}));

export const lessonProgressRelations = relations(lessonProgress, ({ one }) => ({
  user: one(users, { fields: [lessonProgress.userId], references: [users.id] }),
  lesson: one(lessons, { fields: [lessonProgress.lessonId], references: [lessons.id] }),
}));

export const attemptsRelations = relations(attempts, ({ one }) => ({
  user: one(users, { fields: [attempts.userId], references: [users.id] }),
  assessment: one(assessments, {
    fields: [attempts.assessmentId],
    references: [assessments.id],
  }),
}));

export const revenueEntriesRelations = relations(revenueEntries, ({ one }) => ({
  course: one(courses, { fields: [revenueEntries.courseId], references: [courses.id] }),
  enrollment: one(enrollments, {
    fields: [revenueEntries.enrollmentId],
    references: [enrollments.id],
  }),
}));
