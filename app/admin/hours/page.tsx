"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/Spinner";
import { HourType } from "@/types/hours";
import { SelectionPlayerModal } from "@/components/SelectionPlayerModal";
import { PlayerType } from "@/types/players";
import { AlertModal } from "@/components/AlertModal";

export default function HoursPage() {
  const getToday = () => new Date().toISOString().split("T")[0];

  const [start, setStart] = useState(getToday());
  const [end, setEnd] = useState(getToday());
  const [activeFilter, setActiveFilter] = useState("today");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<number | "">("");

  const [newHours, setNewHours] = useState<number | "">("");

  const [selectedPlayer, setSelectedPlayer] = useState<PlayerType>();

  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [errorHoursModalOpen, setErrorHoursModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // 🔥 FILTROS
  const setToday = () => {
    const today = getToday();
    setStart(today);
    setEnd(today);
    setActiveFilter("today");
  };

  const setYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const date = d.toISOString().split("T")[0];

    setStart(date);
    setEnd(date);
    setActiveFilter("yesterday");
  };

  const setWeek = () => {
    const now = new Date();
    const first = new Date(now);
    first.setDate(now.getDate() - now.getDay());

    setStart(first.toISOString().split("T")[0]);
    setEnd(getToday());
    setActiveFilter("week");
  };

  const setMonth = () => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);

    setStart(first.toISOString().split("T")[0]);
    setEnd(getToday());
    setActiveFilter("month");
  };

  const getBtnClass = (type: string) =>
    `px-4 py-2 rounded-xl transition ${
      activeFilter === type
        ? "bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.6)]"
        : "bg-white/10 hover:bg-white/20"
    }`;

  // 🔥 FETCH
  const fetchHours = async (): Promise<HourType[]> => {
    const params = new URLSearchParams();

    if (start) params.append("start", start);
    if (end) params.append("end", end);

    const res = await fetch(`/api/hours?${params.toString()}`);
    return res.json();
  };

  const { data: hours = [], isLoading } = useQuery({
    queryKey: ["hours", start, end],
    queryFn: fetchHours,
  });

  const total = hours.reduce((acc, h) => acc + h.quantity, 0);

  // ✏️ UPDATE
  const updateMutation = useMutation({
    mutationFn: async ({ id, quantity, player }: HourType) => {
      const res = await fetch(`/api/hours/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity, playerId: player.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hours"] });
      setEditingId(null);
    },
  });

  // ➕ CREATE
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPlayer) throw new Error("Selecciona un jugador");
      if (!newHours) throw new Error("Ingresa horas");

      const res = await fetch("/api/hours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerId: selectedPlayer.id,
          quantity: newHours,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hours"] });
      setNewHours("");
      setSelectedPlayer(undefined);
    },
  });

  const handleAddHour = () => {
    if (!selectedPlayer || !newHours) {
      setErrorHoursModalOpen(true);
    }
    createMutation.mutate();
  };

  return (
    <div className="min-h-screen text-white p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-center">
        ⏱ Reporte de Horas
      </h1>

      {/* 🔥 FILTROS */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-4 mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={setToday} className={getBtnClass("today")}>
            Hoy
          </button>

          <button onClick={setYesterday} className={getBtnClass("yesterday")}>
            Ayer
          </button>

          <button onClick={setWeek} className={getBtnClass("week")}>
            Semana
          </button>

          <button onClick={setMonth} className={getBtnClass("month")}>
            Mes
          </button>
        </div>

        {/* 📅 INPUTS */}
        <div className="flex gap-3">
          <input
            type="date"
            value={start}
            onChange={(e) => {
              setStart(e.target.value);
              setActiveFilter("");
            }}
            className="p-3 rounded-xl bg-white/10 border border-white/20"
          />

          <input
            type="date"
            value={end}
            onChange={(e) => {
              setEnd(e.target.value);
              setActiveFilter("");
            }}
            className="p-3 rounded-xl bg-white/10 border border-white/20"
          />
        </div>
      </div>

      {/* 💰 TOTAL */}
      <div className="mb-4 text-lg font-bold text-purple-400">
        Total horas: {total}h
      </div>

      {/* ➕ CREAR */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-4 mb-6 flex gap-3">
        <button
          onClick={() => setPlayerModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
        >
          {selectedPlayer?.name || "Seleccionar jugador"}
        </button>

        <input
          type="number"
          step="0.5"
          placeholder="Horas"
          value={newHours}
          onChange={(e) => setNewHours(Number(e.target.value))}
          className="p-3 rounded-xl bg-white/10 border border-white/20"
        />

        <button
          onClick={handleAddHour}
          className="px-4 py-2 rounded-xl bg-purple-600"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? <Spinner size="sm" color="secondary"/> : "+ Agregar"}
        </button>
      </div>

      {/* 📋 LISTA */}
      <div className="bg-black/40 rounded-xl border border-white/10">
        {isLoading ? (
          <Spinner />
        ) : hours.length ? (
          hours.map((h) => (
            <div
              key={h.id}
              className="flex justify-between items-center px-4 py-3 border-b border-white/10"
            >
              <span>{h.player.name}</span>

              {editingId === h.id ? (
                <input
                  type="number"
                  step="0.5"
                  value={tempValue}
                  onChange={(e) => setTempValue(Number(e.target.value))}
                  onBlur={() =>
                    updateMutation.mutate({
                      ...h,
                      quantity: Number(tempValue),
                    })
                  }
                  className="w-20 p-1 rounded bg-white/10 border border-white/20 text-center"
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => {
                    setEditingId(h.id);
                    setTempValue(h.quantity);
                  }}
                  className="text-purple-400 font-bold cursor-pointer"
                >
                  {h.quantity}h
                </span>
              )}

              <span className="text-xs opacity-60">
                {new Date(h.createdAt).toLocaleString()}
              </span>

              {updateMutation.isPending && editingId === h.id && (
                <Spinner size="sm" />
              )}
            </div>
          ))
        ) : (
          <p className="text-center py-6 opacity-50">No hay registros</p>
        )}
      </div>

      {/* 🎮 MODAL */}
      <SelectionPlayerModal
        open={playerModalOpen}
        setOpen={setPlayerModalOpen}
        isPending={false}
        selectedPlayer={selectedPlayer}
        setSelectedPlayer={setSelectedPlayer}
        onSelect={() => {
          setPlayerModalOpen(false);
        }}
      />
      <AlertModal
        open={errorHoursModalOpen}
        title="Agregar horas"
        message={"Todos los campos son obligatorios."}
        icon="error"
        onClose={() => {
          setErrorHoursModalOpen(false);
        }}
        loading={createMutation.isPending}
        hiddenAction
      />
    </div>
  );
}
