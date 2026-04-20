import { prismaClient } from "@/utils/constanst";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: queueId } = await context.params;

    if (!queueId) {
      return NextResponse.json(
        { success: false, message: "ID requerido" },
        { status: 400 }
      );
    }

    await prismaClient.queue.delete({
      where: { id: queueId },
    });

    return NextResponse.json({
      success: true,
      message: "Eliminado de la cola",
    });
  } catch (error) {
    console.error("ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Error al eliminar de la cola" },
      { status: 500 }
    );
  }
}
