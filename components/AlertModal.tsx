"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

type Props = {
  title: string;
  message?: string;
  icon?: "warning" | "error" | "success";
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export function AlertModal({
  title,
  message,
  icon,
  open,
  onClose,
  onConfirm,
  loading,
}: Props) {
  const icons = {
    warning: "⚠️",
    error: "❌",
    success: "✅",
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="bg-black/90 text-white border border-white/10 
        rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.4)] max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-red-400">
            {icons[icon || "warning"]} {title}
          </DialogTitle>
        </DialogHeader>

        <p className="text-center opacity-70 mt-2">{message}</p>

        {/* BOTONES */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
