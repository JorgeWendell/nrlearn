import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  if (pathname.startsWith("/aluno")) {
    if (!role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "ALUNO") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (pathname.startsWith("/docente") && pathname !== "/docente/login") {
    if (!role) {
      return NextResponse.redirect(new URL("/docente/login", req.url));
    }
    if (role !== "PROFESSOR") {
      return NextResponse.redirect(new URL("/docente/login", req.url));
    }
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!role) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/aluno",
    "/aluno/:path*",
    "/docente",
    "/docente/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
