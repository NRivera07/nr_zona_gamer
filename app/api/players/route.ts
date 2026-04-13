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
