"use client";
import { LoginModal } from "@/components/LoginModal";
import { useState } from "react";

export default function Home() {
  const [openLoginModal, setOpenLoginModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-7">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-10 text-center">
        ¿Quién eres?
      </h1>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
        {/* Público */}
        <div
          className="flex-1 h-52 md:h-80 rounded-2xl flex flex-col items-center justify-center 
      bg-gradient-to-br from-green-500 to-blue-500 
      hover:scale-105 active:scale-95 transition-all duration-300 
      cursor-pointer shadow-lg py-4"
        >
          <span className="text-4xl md:text-6xl">🎮</span>
          <p className="text-xl md:text-2xl font-bold mt-3">Público</p>
          <p className="text-xs md:text-sm mt-1">Ver rankings y jugadores</p>
        </div>

        {/* Admin */}
        <div
          className="flex-1 h-52 md:h-80 rounded-2xl flex flex-col items-center justify-center 
      bg-gradient-to-br from-purple-600 to-red-500 
      hover:scale-105 active:scale-95 transition-all duration-300 
      cursor-pointer shadow-lg py-4"
          onClick={() => setOpenLoginModal(true)}
        >
          <span className="text-4xl md:text-6xl">⚙️</span>
          <p className="text-xl md:text-2xl font-bold mt-3">Admin</p>
          <p className="text-xs md:text-sm mt-1">Gestionar sistema</p>
        </div>
      </div>
      <LoginModal open={openLoginModal} setOpen={setOpenLoginModal} />
    </div>
  );
}
