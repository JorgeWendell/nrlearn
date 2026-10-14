import { config } from "dotenv";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

config({ path: ".env.local" });
config({ path: ".env" });

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida");

  const client = postgres(url);
  const db = drizzle(client, { schema });

  const password = await hash("nrlearn123", 10);

  async function upsertUser(
    name: string,
    email: string,
    role: "ALUNO" | "PROFESSOR" | "ADMIN",
  ) {
    const [existing] = await db.select().from(schema.users).where(eq(schema.users.email, email));
    if (existing) return existing;
    const [created] = await db
      .insert(schema.users)
      .values({ name, email, passwordHash: password, role })
      .returning();
    return created;
  }

  await upsertUser("Administrador NRLearn", "admin@nrlearn.local", "ADMIN");
  await upsertUser("Instrutor Carlos Mendes", "professor@nrlearn.local", "PROFESSOR");
  const aluno = await upsertUser("Aluno Demo", "aluno@nrlearn.local", "ALUNO");

  const [existingCourse] = await db
    .select()
    .from(schema.courses)
    .where(eq(schema.courses.slug, "nr-35-trabalho-em-altura"));

  let course = existingCourse;
  if (!course) {
    const [created] = await db
      .insert(schema.courses)
      .values({
        slug: "nr-35-trabalho-em-altura",
        title: "NR-35 — Trabalho em Altura",
        description:
          "Capacitação para trabalho em altura com foco em prevenção, EPIs, análise de risco e procedimentos de emergência utilizados por brigadas e equipes de bombeiros civis.",
        workloadHours: 8,
        price: "297.00",
        published: true,
      })
      .returning();
    course = created;

    const [l1] = await db
      .insert(schema.lessons)
      .values({
        courseId: course.id,
        title: "Introdução e conceitos da NR-35",
        videoUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
        order: 1,
      })
      .returning();

    await db.insert(schema.lessons).values({
      courseId: course.id,
      title: "EPIs, ancoragem e resgate",
      videoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
      order: 2,
    });

    const [quiz] = await db
      .insert(schema.assessments)
      .values({
        courseId: course.id,
        type: "QUIZ",
        title: "Quiz — conceitos iniciais",
        order: 1,
        lessonId: l1.id,
      })
      .returning();

    const [q1] = await db
      .insert(schema.questions)
      .values({
        assessmentId: quiz.id,
        prompt: "A NR-35 estabelece requisitos mínimos de proteção para o trabalho em altura acima de:",
        order: 1,
      })
      .returning();

    await db.insert(schema.options).values([
      { questionId: q1.id, text: "1,00 metro", isCorrect: false },
      { questionId: q1.id, text: "2,00 metros", isCorrect: true },
      { questionId: q1.id, text: "3,00 metros", isCorrect: false },
      { questionId: q1.id, text: "5,00 metros", isCorrect: false },
    ]);

    const [prova] = await db
      .insert(schema.assessments)
      .values({
        courseId: course.id,
        type: "PROVA",
        title: "Prova final — NR-35",
        order: 10,
      })
      .returning();

    const provaQs = [
      {
        prompt: "O trabalho em altura exige análise de risco. Quem deve participar dessa análise?",
        answers: [
          ["Somente o SESMT", false],
          ["Somente o trabalhador", false],
          ["Trabalhador e equipe responsável, conforme o planejamento", true],
          ["Apenas a CIPA", false],
        ],
      },
      {
        prompt: "Antes de iniciar a atividade em altura, o trabalhador deve:",
        answers: [
          ["Inspecionar os EPIs e as condições do local", true],
          ["Dispensar o cinto se a altura for inferior a 3 metros", false],
          ["Começar e comunicar depois", false],
          ["Usar apenas capacete", false],
        ],
      },
      {
        prompt: "Sistemas de proteção contra quedas devem ser:",
        answers: [
          ["Opcionais se houver experiência", false],
          ["Dimensionados, inspecionados e compatíveis com a atividade", true],
          ["Substituídos por cordas improvisadas", false],
          ["Usados somente em treino", false],
        ],
      },
    ] as const;

    for (const [i, q] of provaQs.entries()) {
      const [row] = await db
        .insert(schema.questions)
        .values({ assessmentId: prova.id, prompt: q.prompt, order: i + 1 })
        .returning();
      await db.insert(schema.options).values(
        q.answers.map(([text, isCorrect]) => ({
          questionId: row.id,
          text,
          isCorrect,
        })),
      );
    }

    const [enroll] = await db
      .insert(schema.enrollments)
      .values({
        userId: aluno.id,
        courseId: course.id,
        status: "ATIVA",
        releasedAt: new Date(),
      })
      .returning();

    await db.insert(schema.revenueEntries).values({
      courseId: course.id,
      enrollmentId: enroll.id,
      amount: course.price,
    });
  }

  console.log("Seed concluído.");
  console.log("Admin: admin@nrlearn.local / nrlearn123");
  console.log("Professor: professor@nrlearn.local / nrlearn123");
  console.log("Aluno: aluno@nrlearn.local / nrlearn123");

  await client.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
