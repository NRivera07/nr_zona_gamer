"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen text-white">
      {/* 🔥 SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex w-64 flex-col bg-black/60 backdrop-blur-md border-r border-white/10 p-4">
        <h2 className="text-xl font-extrabold mb-8 text-center">🎮 NR Gamer</h2>

        <nav className="flex flex-col gap-3">
          <MenuItem
            label="🎮 Consolas"
            href="/admin/control-center"
            onClick={() => setOpen(false)}
          />
          <MenuItem
            label="👤 Jugadores"
            href="/admin/players"
            onClick={() => setOpen(false)}
          />
          <MenuItem
            label="⏱ Turnos"
            href="/admin/hours"
            onClick={() => setOpen(false)}
          />
          <MenuItem
            label="⚙️ Configuración"
            href="/"
            onClick={() => setOpen(false)}
          />
        </nav>
      </aside>

      {/* 🔥 CONTENIDO */}
      <div className="flex-1 flex flex-col">
        {/* 📱 HEADER MOBILE */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-black/60 backdrop-blur-md border-b border-white/10">
          <h1 className="font-bold">🎮 NR Gamer</h1>

          <button onClick={() => setOpen(true)} className="text-2xl">
            ☰
          </button>
        </header>

        {/* 📱 MENU MOBILE (overlay) */}
        {open && (
          <div className="fixed inset-0 z-50 flex">
            {/* overlay oscuro */}
            <div
              className="flex-1 bg-black/70"
              onClick={() => setOpen(false)}
            />

            {/* drawer */}
            <div className="w-64 bg-black p-5 border-l border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              <h2 className="text-xl font-bold mb-6">🎮 NR Gamer</h2>

              <nav className="flex flex-col gap-3">
                <MenuItem
                  label="🎮 Consolas"
                  href="/admin/control-center"
                  onClick={() => setOpen(false)}
                />
                <MenuItem
                  label="👤 Jugadores"
                  href="/admin/players"
                  onClick={() => setOpen(false)}
                />
                <MenuItem
                  label="⏱ Turnos"
                  href="/admin/hours"
                  onClick={() => setOpen(false)}
                />
                <MenuItem
                  label="⚙️ Configuración"
                  href="/"
                  onClick={() => setOpen(false)}
                />
              </nav>
            </div>
          </div>
        )}

        {/* 🧱 MAIN */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

function MenuItem({
  label,
  href,
  onClick,
}: {
  label: string;
  href: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      className="block px-4 py-3 rounded-xl transition-all bg-white/5 hover:bg-white/10 hover:scale-105 cursor-pointer border border-transparent hover:border-purple-500/40 shadow hover:shadow-[0_0_10px_rgba(168,85,247,0.5)]"
      onClick={onClick}
    >
      {label}
    </Link>
  );
}
