import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estudio Pilates",
  description: "Sistema de gestao para estudio de Pilates e musculacao",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
