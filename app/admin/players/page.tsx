"use client";

import { useState } from "react";
import { Spinner } from "@/components/Spinner";
import { PlayerType } from "@/types/players";
import { CreatePlayerModal } from "@/components/CreatePlayerModal";
import { useQuery } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 5;

export default function PlayersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchPlayers = async () => {
    const res = await fetch("/api/players");
    return res.json();
  };

  const { data: players = [], isLoading } = useQuery({
    queryKey: ["players"],
    queryFn: fetchPlayers,
  });
  // 🔍 FILTRO
  const filteredPlayers = players.filter((player: PlayerType) =>
    player.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlayers.length / ITEMS_PER_PAGE);

  const paginatedPlayers = filteredPlayers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner size="full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* 🔥 HEADER PRO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold">👤 Jugadores</h1>

        {/* ACCIONES */}
        <div className="flex gap-3">
          {/* 🔍 BUSCADOR */}
          <input
            type="text"
            placeholder="Buscar jugador..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset paginación
            }}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
          />

          {/* ➕ BOTÓN CREAR */}
          <button
            className="px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 active:scale-95 transition-all shadow-[0_0_10px_rgba(168,85,247,0.6)]"
            onClick={() => setCreateModalOpen(true)}
          >
            + Nuevo
          </button>
        </div>
      </div>

      {/* 📋 TABLA */}
      <div className="bg-zinc-900/70 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {/* HEADER */}
        <div className="grid grid-cols-5 px-6 py-4 text-sm font-bold border-b border-white/10 bg-white/5">
          <span>Jugador</span>
          <span>Teléfono</span>
          <span>Consola</span>
          <span>Horas</span>
          <span className="text-right">Acción</span>
        </div>

        {/* FILAS */}
        {paginatedPlayers.length ? (
          paginatedPlayers.map((player: PlayerType) => {
            const hasConsole = player.assignedConsole;
            const totalHours = (player.hours || []).reduce(
              (acc, h) => acc + Number(h.quantity),
              0
            );

            return (
              <div
                key={player.id}
                className="grid grid-cols-5 px-6 py-4 text-sm items-center border-b border-white/5 hover:bg-white/5 transition-all"
              >
                <span className="font-semibold">{player.name}</span>

                <span className="opacity-70">{player.phone}</span>

                <span>
                  {hasConsole ? (
                    <span className="text-green-400">
                      🎮 {player.assignedConsole?.code}
                    </span>
                  ) : (
                    <span className="opacity-40">Ninguna</span>
                  )}
                </span>
                <span className="text-purple-400 font-semibold">
                  ⏱ {totalHours}h
                </span>

                <div className="flex justify-end gap-3">
                  {/* Editar */}
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-all hover:scale-110">
                    ✏️
                  </button>

                  {/* Eliminar */}
                  <button className="p-2 rounded-lg hover:bg-red-600/20 transition-all hover:scale-110">
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center opacity-50">
            No se encontraron jugadores
          </div>
        )}
      </div>

      {/* 🔢 PAGINACIÓN */}
      {totalPages > 0 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-white/10 disabled:opacity-30"
          >
            ←
          </button>

          <span className="text-sm opacity-70">
            Página {page} de {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-white/10 disabled:opacity-30"
          >
            →
          </button>
        </div>
      )}
      <CreatePlayerModal open={createModalOpen} setOpen={setCreateModalOpen} />
    </div>
  );
}
