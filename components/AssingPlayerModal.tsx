"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Spinner } from "./Spinner";
import { PlayerType } from "@/types/players";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Player } from "@/src/generated/prisma/client";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  consoleId: string;
};

export function AssignPlayerModal({ open, setOpen, consoleId }: Props) {
  const [search, setSearch] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");

  const queryClient = useQueryClient();

  const fetchPlayers = async () => {
    const res = await fetch("/api/players");
    return res.json();
  };

  const {
    data: players = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["players"],
    queryFn: fetchPlayers,
    enabled: open,
  });

  const filtered = players.filter((p: Player) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const assingPlayerMutation = useMutation({
    mutationFn: async (assignedPlayer: { playerId: string }) => {
      await fetch("/api/consoles/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consoleId,
          playerId: assignedPlayer.playerId,
        }),
      });
    },

    onSuccess: () => {
      toast.success("Jugador asignado exitosamente");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["consoles"] });
    },
    onError: () => {
      toast.error("Error al asignar el jugador");
    },
  });

  const { mutate, isPending } = assingPlayerMutation;

  const handleAssign = (playerId: string) => {
    mutate({ playerId });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="bg-black/90 backdrop-blur-md border border-white/10 
            text-white rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)] 
            max-w-lg w-full overflow-hidden"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-center">
              🎮 Seleccionar jugador
            </DialogTitle>
          </DialogHeader>

          {/* 🔍 BUSCADOR */}
          <input
            type="text"
            placeholder="Buscar jugador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mt-2 p-3 rounded-xl bg-white/10 border border-white/20
            focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* 📋 LISTA */}
          <div className="mt-4 max-h-80 overflow-y-auto flex flex-col gap-2">
            {isLoading || isFetching ? (
              <div className="flex justify-center py-6">
                <Spinner />
              </div>
            ) : filtered.length ? (
              filtered.map((player: PlayerType) => (
                <button
                  key={player.id}
                  onClick={() => {
                    if (!player.assignedConsole) {
                      setSelectedPlayerId(player.id);
                      handleAssign(player.id);
                    }
                  }}
                  className="flex justify-between items-center px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-purple-500/40 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isPending || Boolean(player.assignedConsole)}
                >
                  <span className="font-semibold">{player.name}</span>

                  {isPending && selectedPlayerId === player.id ? (
                    <Spinner size="sm" />
                  ) : player.assignedConsole ? (
                    <span className="text-xs text-red-400">Ocupado 🎮</span>
                  ) : (
                    <span className="text-xs text-green-400">Disponible</span>
                  )}
                </button>
              ))
            ) : (
              <p className="text-center opacity-50 py-6">No hay jugadores</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
