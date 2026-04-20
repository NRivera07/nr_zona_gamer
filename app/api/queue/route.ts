import { prismaClient } from "@/utils/constanst";
import { NextResponse } from "next/server";

// 🔥 Obtener lista de espera
export async function GET() {
  const queue = await prismaClient.queue.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      player: true,
    },
  });

  return NextResponse.json(queue);
}

// 🔥 Agregar a la cola
export async function POST(req: Request) {
  try {
    const { playerId } = await req.json();

    if (!playerId) {
      return NextResponse.json(
        { success: false, message: "playerId requerido" },
        { status: 400 }
      );
    }

    // 🔥 1. Validar si hay consolas libres
    const availableConsole = await prismaClient.console.findFirst({
      where: {
        assignedPlayer: null, // 👈 clave
      },
    });

    if (availableConsole) {
      return NextResponse.json(
        {
          success: false,
          message: "Hay consolas disponibles, no puedes entrar a la cola",
        },
        { status: 400 }
      );
    }

    // 🔥 2. Evitar duplicados en cola
    const exists = await prismaClient.queue.findFirst({
      where: { playerId },
    });

    if (exists) {
      return NextResponse.json(
        { success: false, message: "Ya está en la cola" },
        { status: 400 }
      );
    }

    // 🔥 3. Crear en cola
    const newQueue = await prismaClient.queue.create({
      data: { playerId },
      include: { player: true },
    });

    return NextResponse.json({
      success: true,
      queue: newQueue,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Error al agregar a la cola" },
      { status: 500 }
    );
  }
}
