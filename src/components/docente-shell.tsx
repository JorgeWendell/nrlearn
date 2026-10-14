export function DocenteShell({
  kicker = "Área docente",
  title,
  children,
}: {
  kicker?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="page max-w-5xl py-10">
      <p className="kicker">{kicker}</p>
      <h1 className="display mt-2 text-3xl md:text-4xl">{title}</h1>
      <div className="mt-8">{children}</div>
    </main>
  );
}
