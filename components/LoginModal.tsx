"use client";

import { Spinner } from "./Spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState } from "react";

type LoginModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function LoginModal({ open, setOpen }: LoginModalProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!name || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ name, password }),
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = "admin/control-center";
    } else {
      setError("Usuario o contraseña incorrectos");
    }
    setLoading(false);
  };

  const handleClose = () => {
    setName("");
    setPassword("");
    setError("");
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) handleClose();
      }}
    >
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
        {error && (
          <p className="font-black bg-red-500/80 p-3 rounded text-sm text-center">
            {error}
          </p>
        )}
        <input
          type="text"
          placeholder="Usuario"
          className="w-full mt-4 p-3 rounded-xl bg-white/10 border border-white/20 
          focus:outline-none focus:ring-2 focus:ring-purple-500 
          placeholder:text-gray-400"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mt-4 p-3 rounded-xl bg-white/10 border border-white/20 
          focus:outline-none focus:ring-2 focus:ring-purple-500 
          placeholder:text-gray-400"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Botón */}
        {loading ? (
          <Spinner />
        ) : (
          <button
            className="mt-5 w-full text-center py-3 rounded-xl font-bold 
          bg-gradient-to-r from-purple-600 to-red-500 
          hover:scale-105 active:scale-95 transition-all duration-300 
          shadow-lg"
            onClick={handleLogin}
            disabled={loading}
          >
            Entrar
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
