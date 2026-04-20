import { prismaClient } from "@/utils/constanst";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
      return NextResponse.json([]);
    }

    const startDate = new Date(`${start}T00:00:00`);
    const endDate = new Date(`${end}T00:00:00`);
    endDate.setDate(endDate.getDate() + 1);

    const hours = await prismaClient.hours.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        player: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(hours);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Error al obtener horas" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { playerId, quantity } = await req.json();

    if (!playerId || !quantity) {
      return NextResponse.json(
        { success: false, message: "Datos requeridos" },
        { status: 400 }
      );
    }

    const hour = await prismaClient.hours.create({
      data: {
        playerId,
        quantity: Number(quantity),
      },
    });

    return NextResponse.json({ success: true, hour });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Error al crear hora" },
      { status: 500 }
    );
  }
}
