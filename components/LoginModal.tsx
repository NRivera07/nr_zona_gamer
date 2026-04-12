"use client";

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
    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ name, password }),
    });

    const data = await res.json();

    console.log(data);

    if (data.success) {
      window.location.href = "/control-center";
    } else {
      setError("Usuario o contraseña incorrectos");
    }
    setLoading(false);
  };

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
        {error && (
          <p className=" font-black mt-2 bg-red-400 p-5 text-center rounded">
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
          <div className="flex justify-center mt-5">
            <div className="w-6 h-6 border-2 border-white/30 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
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
