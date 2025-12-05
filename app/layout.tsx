import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";

import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "LicitDoc",
  description: "Repositório para documentos de licitação",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="en">
        <body className="min-h-screen">
          <main>
            <Toaster />
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
