import { eq } from "drizzle-orm";
import { AlunoCursosExplorer, type AlunoCatalogCourse } from "@/components/aluno-cursos-explorer";
import { AlunoPageHeader } from "@/components/aluno-page-header";
import { db } from "@/db";
import { courses, enrollments } from "@/db/schema";
import { requireAluno } from "@/lib/session";

export default async function AlunoCursosPage() {
  const user = await requireAluno();
  const published = await db.select().from(courses).where(eq(courses.published, true));
  const mine = await db.select().from(enrollments).where(eq(enrollments.userId, user.id));
  const statusByCourse = new Map(mine.map((item) => [item.courseId, item.status]));

  const catalog: AlunoCatalogCourse[] = published.map((course) => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    workloadHours: course.workloadHours,
    price: course.price,
    category: course.category,
    level: course.level,
    coverUrl: course.coverUrl,
    featured: course.featured,
    enrollmentStatus: statusByCourse.get(course.id) ?? null,
  }));

  return (
    <div>
      <AlunoPageHeader
        crumbs={["Início", "Cursos"]}
        title="Cursos"
        subtitle="Explore nossos cursos e expanda suas fronteiras de aprendizado."
        icon={
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="5" width="16" height="14" rx="2" />
            <path d="m10 9 6 4-6 4V9Z" />
          </svg>
        }
      />
      {catalog.length === 0 ? (
        <p className="text-sm text-white/55">Nenhum curso publicado no momento.</p>
      ) : (
        <AlunoCursosExplorer courses={catalog} />
      )}
    </div>
  );
}
