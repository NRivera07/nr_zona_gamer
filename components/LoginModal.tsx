"use client";

import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

type LoginModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function LoginModal({ open, setOpen }: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="bg-black/80 backdrop-blur-md border border-white/10 
        text-white rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)]"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            ⚙️ Acceso Admin
          </DialogTitle>
        </DialogHeader>

        {/* Input */}
        <input
          type="text"
          placeholder="Usuario"
          className="w-full mt-4 p-3 rounded-xl bg-white/10 border border-white/20 
          focus:outline-none focus:ring-2 focus:ring-purple-500 
          placeholder:text-gray-400"
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mt-4 p-3 rounded-xl bg-white/10 border border-white/20 
          focus:outline-none focus:ring-2 focus:ring-purple-500 
          placeholder:text-gray-400"
        />

        {/* Botón */}
        <Link
          href={"/control-center"}
          className="mt-5 w-full text-center py-3 rounded-xl font-bold 
          bg-gradient-to-r from-purple-600 to-red-500 
          hover:scale-105 active:scale-95 transition-all duration-300 
          shadow-lg"
        >
          Entrar
        </Link>
      </DialogContent>
    </Dialog>
  );
}
