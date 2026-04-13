"use client";

import { Spinner } from "@/components/Spinner";
import { ConsoleType } from "@/src/generated/prisma/types/consoles";
import { useEffect, useState } from "react";

export default function ControlCenter() {
  const [consoles, setConsoles] = useState<ConsoleType[]>([]);

  useEffect(() => {
    fetch("/api/consoles")
      .then((res) => res.json())
      .then((data) => setConsoles(data));
  }, []);

  return (
    <>
      {consoles?.length ? (
        <div className="min-h-screen text-white p-6">
          {/* 🔥 TÍTULO */}
          <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center">
            🎮 Centro de control
          </h1>

          {/* 🔥 CONTENEDOR GENERAL (para separar del fondo) */}
          <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-6">
            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {consoles.map((console) => {
                const isOccupied = console.assignedPlayer;

                return (
                  <div
                    key={console.id}
                    className={`relative rounded-3xl p-4 transition-all duration-300
                    bg-white/5 backdrop-blur-md
                    border border-white/10
                    hover:scale-105

                    ${
                      isOccupied
                        ? "shadow-[0_0_25px_rgba(239,68,68,0.4)] border-red-500/40"
                        : "shadow-[0_0_25px_rgba(34,197,94,0.4)] border-green-400/40"
                    }`}
                  >
                    {/* 🔴🟢 LED */}
                    <div
                      className={`absolute top-3 right-3 w-3 h-3 rounded-full 
                      ${
                        isOccupied
                          ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)]"
                          : "bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.9)]"
                      }`}
                    />

                    {/* 🎮 PANTALLA */}
                    <div
                      className="bg-black/80 rounded-xl p-5 flex flex-col items-center justify-center 
                    border border-white/10 shadow-inner"
                    >
                      <span className="text-5xl mb-2">🎮</span>

                      <h2 className="text-xl font-extrabold">{console.name}</h2>

                      <p className="text-xs opacity-50">{console.code}</p>

                      <p className="mt-3 text-sm font-semibold">
                        {console.assignedPlayer
                          ? `Jugador: ${console.assignedPlayer?.name}`
                          : "Disponible"}
                      </p>
                    </div>

                    {/* 🔘 BOTÓN */}
                    <div className="mt-4 flex justify-end items-center px-2">
                      <button
                        className={`text-sm font-semibold px-5 py-2.5 rounded-xl 
                        transition-all duration-300 w-full
                        hover:scale-105 active:scale-95 cursor-pointer
                        ${
                          isOccupied
                            ? "bg-red-600 hover:bg-red-700 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                            : "bg-green-600 hover:bg-green-700 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                        }`}
                      >
                        {isOccupied ? "🔓 Liberar" : "🎮 Asignar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex justify-center items-center">
          <Spinner size="full" />
        </div>
      )}
    </>
  );
}
