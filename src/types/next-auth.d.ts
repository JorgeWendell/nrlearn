import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "ALUNO" | "PROFESSOR" | "ADMIN";
  }

  interface Session {
    user: {
      id: string;
      role: "ALUNO" | "PROFESSOR" | "ADMIN";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ALUNO" | "PROFESSOR" | "ADMIN";
  }
}
