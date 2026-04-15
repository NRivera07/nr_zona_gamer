import { NextResponse } from "next/server";
import { prismaClient } from "@/utils/constanst";

export async function GET() {
  const players = await prismaClient.player.findMany({
    include: {
      assignedConsole: true,
      hours: true,
    },
  });

  return NextResponse.json(players);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, hours } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const player = await prismaClient.player.create({
      data: {
        name,
        phone,

        ...(hours !== null &&
          hours !== undefined &&
          hours !== "" && {
            hours: {
              create: {
                quantity: Number(hours),
              },
            },
          }),
      },
      include: {
        hours: true,
      },
    });

    return NextResponse.json({
      success: true,
      player,
    });
  } catch (error: unknown) {
    console.error(error);

    if (typeof error === "object" && error !== null && "code" in error) {
      const err = error as { code?: string };

      if (err.code === "P2002") {
        return NextResponse.json(
          { success: false, message: "El jugador ya existe" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: "Error del servidor" },
      { status: 500 }
    );
  }
}
