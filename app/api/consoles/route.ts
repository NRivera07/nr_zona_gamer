import { prismaClient } from "@/utils/constanst";
import { NextResponse } from "next/server";

export async function GET() {
  const consoles = await prismaClient.console.findMany({
    include: {
      assignedPlayer: true,
    },
  });

  return NextResponse.json(consoles);
}
