"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "./Spinner";
import { toast } from "react-toastify";
import { useState } from "react";
import { SelectionPlayerModal } from "./SelectionPlayerModal";
import { AlertModal } from "./AlertModal";
import { PlayerType } from "@/types/players";

type QueueItem = {
  id: string;
  player: {
    id: string;
    name: string;
  };
};

export function QueueList() {
  const [queueModalOpen, setQueueModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerType>();
  const [selectedQueue, setSelectedQueue] = useState({
    playerName: "",
    idQueue: "",
  });
  const queryClient = useQueryClient();

  // 🔥 Obtener cola
  const fetchQueue = async (): Promise<QueueItem[]> => {
    const res = await fetch("/api/queue");
    return res.json();
  };

  const { data: queue = [], isLoading } = useQuery({
    queryKey: ["queue"],
    queryFn: fetchQueue,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/queue/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queue"] });
      setConfirmModalOpen(false);
      toast.success("Eliminado de la cola");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const addPlayerToQueueMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerId: selectedPlayer?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      return data;
    },

    onSuccess: () => {
      toast.success("Jugador añadido a la lista de espera exitosamente");
      setQueueModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["queue"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    mutate: mutateAddPlayerToQueue,
    isPending: isPendinAddPlayerToQueue,
  } = addPlayerToQueueMutation;

  const addPlayerToQueue = () => {
    mutateAddPlayerToQueue();
  };

  return (
    <>
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold mb-4">🎟️ Lista de espera</h2>
          <button
            onClick={() => setQueueModalOpen(true)}
            className="px-3 py-1.5 text-sm rounded-lg 
    bg-purple-600 hover:bg-purple-700 transition"
          >
            + Agregar
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : queue.length ? (
          <div className="flex flex-col gap-2">
            {queue.map((item, index) => (
              <div
                key={item.id}
                className="flex justify-between items-center px-4 py-2 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-purple-400 font-bold">
                    #{index + 1}
                  </span>
                  <span className="font-semibold">{item.player.name}</span>
                </div>

                <button
                  onClick={() => {
                    setConfirmModalOpen(true);
                    setSelectedQueue({
                      idQueue: item.id,
                      playerName: item.player.name,
                    });
                  }}
                  className="text-xs px-3 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 transition"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm opacity-50 text-center py-4">
            No hay jugadores en espera
          </p>
        )}
      </div>
      <SelectionPlayerModal
        open={queueModalOpen}
        setOpen={setQueueModalOpen}
        isPending={isPendinAddPlayerToQueue}
        onSelect={addPlayerToQueue}
        setSelectedPlayer={setSelectedPlayer}
        selectedPlayer={selectedPlayer}
      />
      <AlertModal
        open={confirmModalOpen}
        title="Eliminar jugador"
        message={`¿Estás seguro de eliminar a ${selectedQueue.playerName}? Esta acción no se puede deshacer.`}
        icon="warning"
        onClose={() => {
          setConfirmModalOpen(false);
          setSelectedQueue({ playerName: "", idQueue: "" });
        }}
        loading={removeMutation.isPending}
        onConfirm={() => {
          if (selectedQueue.idQueue) {
            removeMutation.mutate(selectedQueue.idQueue);
          }
        }}
      />
    </>
  );
}
