import { prismaClient } from "@/utils/constanst";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { playerId } = await req.json();

  await prismaClient.player.update({
    where: { id: playerId },
    data: {
      consoleId: null,
    },
  });

  return NextResponse.json({ success: true });
}
