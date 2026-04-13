import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-heading",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "NR Zona Gamer",
  description:
    "Portal web para gestionar información de jugadores, inventario de consolas, asignaciones para turnos de juegos y compartir información sobre rankings, eventos y descuentos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={cn("antialiased", orbitron.variable, rajdhani.variable)}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
