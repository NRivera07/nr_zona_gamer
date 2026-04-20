import { prismaClient } from "@/utils/constanst";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { playerId } = await req.json();

    // 🔥 1. Obtener jugador actual
    const player = await prismaClient.player.findUnique({
      include: {
        assignedConsole: true,
      },
      where: { id: playerId },
    });

    if (!player?.consoleId) {
      return NextResponse.json({ success: false, message: "No tiene consola" });
    }

    const consoleId = player.consoleId;
    const consoleName = player.assignedConsole?.code;

    // 🔥 2. Liberar consola
    await prismaClient.player.update({
      where: { id: playerId },
      data: {
        consoleId: null,
      },
    });

    // 🔥 3. Buscar primer jugador en cola
    const nextInQueue = await prismaClient.queue.findFirst({
      orderBy: { createdAt: "asc" },
      include: { player: true },
    });

    // 🔥 4. Si hay alguien → asignar
    if (nextInQueue) {
      await prismaClient.player.update({
        where: { id: nextInQueue.playerId },
        data: {
          consoleId,
        },
      });

      // 🔥 eliminar de cola
      await prismaClient.queue.delete({
        where: { id: nextInQueue.id },
      });

      return NextResponse.json({
        success: true,
        reassigned: true,
        playerName: nextInQueue.player.name,
        consoleId,
        consoleName,
      });
    }

    return NextResponse.json({
      success: true,
      reassigned: false,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Error al liberar consola" },
      { status: 500 }
    );
  }
}
