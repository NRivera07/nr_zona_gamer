import { prismaClient } from "@/utils/constanst";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, password } = await req.json();

  const user = await prismaClient.user.findUnique({
    where: { name },
  });

  if (!user || user.password !== password) {
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: true });
}
