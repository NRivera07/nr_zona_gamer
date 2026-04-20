"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Spinner } from "./Spinner";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlayerType } from "@/types/players";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  player?: PlayerType;
  isEdit?: boolean;
};

export function PlayerForm({ open, setOpen, player, isEdit }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [hours, setHours] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (player && isEdit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(player.name || "");
      setPhone(player.phone || "");
    }
  }, [player, isEdit]);

  const handleClose = () => {
    setName("");
    setPhone("");
    setHours("");
    setError("");
    setOpen(false);
    setLoading(false);
  };

  const queryClient = useQueryClient();

  const createPlayerMutation = useMutation({
    mutationFn: async (newPlayer: {
      name: string;
      phone: string;
      hours: number | "";
    }) => {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlayer),
      });

      return res.json();
    },

    onSuccess: () => {
      // 🔥 refresca automáticamente la lista
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Jugador creado exitosamente");
    },
    onError: () => {
      toast.error("Error al crear el jugador");
    },
  });

  const updatePlayerMutation = useMutation({
    mutationFn: async (playerId: string) => {
      const res = await fetch(`/api/players/${playerId}`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Jugador editado exitosamente");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    if (!name) {
      setError("El nombre es obligatorio");
      return;
    }

    setLoading(true);

    if (isEdit && player) {
      updatePlayerMutation.mutate(player.id);
      return;
    }
    createPlayerMutation.mutate(
      {
        name,
        phone,
        hours,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="bg-black/80 backdrop-blur-md border border-white/10 
        text-white rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)]"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isEdit ? "✏️ Editar jugador" : "👤 Crear nuevo jugador"}
          </DialogTitle>
        </DialogHeader>

        {/* ERROR */}
        {error && (
          <p className="font-black bg-red-500/80 p-3 rounded text-sm text-center">
            {error}
          </p>
        )}

        {/* INPUTS */}
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-4 p-3 rounded-xl bg-white/10 border border-white/20 
          focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="text"
          placeholder="Teléfono"
          value={phone}
          maxLength={7}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mt-3 p-3 rounded-xl bg-white/10 border border-white/20 
          focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="number"
          step="0.5"
          min="0"
          placeholder="Horas"
          value={hours}
          onChange={(e) => setHours(parseFloat(e.target.value))}
          className="w-full mt-3 p-3 rounded-xl bg-white/10 border border-white/20 
  focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* BOTÓN */}
        {loading ? (
          <div className="mt-4 flex justify-center">
            <Spinner />
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            className="mt-5 w-full py-3 rounded-xl font-bold
            bg-gradient-to-r from-purple-600 to-pink-600
            hover:scale-105 active:scale-95 transition-all
            shadow-[0_0_10px_rgba(168,85,247,0.6)]"
          >
            Guardar
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
