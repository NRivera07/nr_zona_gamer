import { prismaClient } from "@/utils/constanst";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { consoleId, playerId } = await req.json();

    if (!consoleId || !playerId) {
      return NextResponse.json(
        { success: false, message: "Faltan datos" },
        { status: 400 }
      );
    }

    const existingPlayer = await prismaClient.player.findUnique({
      where: { id: playerId },
    });

    if (existingPlayer?.consoleId) {
      return NextResponse.json(
        { success: false, message: "El jugador ya tiene consola asignada" },
        { status: 400 }
      );
    }

    const player = await prismaClient.player.update({
      where: { id: playerId },
      data: {
        consoleId: consoleId,
      },
      include: {
        assignedConsole: true,
      },
    });

    return NextResponse.json({
      success: true,
      player,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Error del servidor" },
      { status: 500 }
    );
  }
}
