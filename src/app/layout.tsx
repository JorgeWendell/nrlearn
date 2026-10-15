import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import { AppChrome } from "@/components/app-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader, SiteHeaderFallback } from "@/components/site-header";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NRLearn — Bombeiros e Normas Regulamentadoras",
  description:
    "Instituição de ensino para formação de bombeiros civis e capacitação em NRs com cursos online.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${serif.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <Suspense fallback={<SiteHeaderFallback />}>
          <AppChrome
            header={
              <Suspense fallback={<SiteHeaderFallback />}>
                <SiteHeader />
              </Suspense>
            }
            footer={<SiteFooter />}
          >
            {children}
          </AppChrome>
        </Suspense>
      </body>
    </html>
  );
}
