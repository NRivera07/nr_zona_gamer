"use client";

const consoles = [
  { id: 1, name: "PS4-1", status: "occupied", player: "Juan" },
  { id: 2, name: "PS4-2", status: "available", player: null },
  { id: 3, name: "PS4-3", status: "occupied", player: "Pedro" },
  { id: 4, name: "PS4-4", status: "available", player: null },
];

export default function ControlCenter() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Panel Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {consoles.map((console) => (
          <div
            key={console.id}
            className={`rounded-2xl p-4 shadow-lg transition-all duration-300
              ${console.status === "occupied" ? "bg-red-600" : "bg-green-600"}`}
          >
            <div className="flex flex-col items-center">
              <span className="text-4xl">🎮</span>

              <h2 className="text-xl font-bold mt-2">{console.name}</h2>

              <p className="text-sm mt-2">
                Estado: {console.status === "occupied" ? "Ocupado" : "Libre"}
              </p>

              <p className="text-sm">Jugador: {console.player || "Ninguno"}</p>

              {console.status === "occupied" && (
                <button className="mt-4 bg-black text-white px-3 py-1 rounded">
                  Liberar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
