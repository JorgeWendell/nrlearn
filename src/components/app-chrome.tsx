"use client";

import { usePathname } from "next/navigation";

export function AppChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAppPanel =
    pathname.startsWith("/aluno") ||
    (pathname.startsWith("/admin") && pathname !== "/admin/login") ||
    (pathname.startsWith("/docente") && pathname !== "/docente/login");

  if (isAppPanel) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      {children}
      {footer}
    </>
  );
}
