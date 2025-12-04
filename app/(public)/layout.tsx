import type { Metadata } from "next";

import Navbar from "@/components/navbar";

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
    <>
      <Navbar />
      {children}
    </>
  );
}
