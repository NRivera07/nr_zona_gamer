import { prismaClient } from "@/utils/constanst";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: playerId } = await context.params;

    if (!playerId) {
      return NextResponse.json(
        { success: false, message: "ID requerido" },
        { status: 400 }
      );
    }

    await prismaClient.hours.deleteMany({
      where: { playerId },
    });

    await prismaClient.player.delete({
      where: { id: playerId },
    });

    return NextResponse.json({
      success: true,
      message: "Jugador eliminado",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Error al eliminar jugador" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const { name, phone, hours } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID requerido" },
        { status: 400 }
      );
    }

    // 🔥 actualizar player
    const updatedPlayer = await prismaClient.player.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
      },
    });

    // 🔥 si vienen horas nuevas → crear registro
    if (hours !== undefined && hours !== null && hours !== "") {
      await prismaClient.hours.create({
        data: {
          playerId: id,
          quantity: Number(hours),
        },
      });
    }

    return NextResponse.json({
      success: true,
      player: updatedPlayer,
    });
  } catch (error: unknown) {
    console.error(error);

    if (typeof error === "object" && error !== null && "code" in error) {
      const err = error as { code?: string };

      if (err.code === "P2002") {
        return NextResponse.json(
          { success: false, message: "Nombre o teléfono ya existe" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: "Error al actualizar jugador" },
      { status: 500 }
    );
  }
}
