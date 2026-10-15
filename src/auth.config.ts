import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = typeof token.id === "string" ? token.id : "";
      const role = token.role;
      session.user.role =
        role === "ALUNO" || role === "PROFESSOR" || role === "ADMIN" ? role : "ALUNO";
      return session;
    },
  },
} satisfies NextAuthConfig;
