import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import { prismaClient } from "@/utils/constanst";

export async function POST(req: Request) {
  const { name, password } = await req.json();

  const user = await prismaClient.user.findUnique({
    where: { name },
  });

  if (!user || user.password !== password) {
    return NextResponse.json(
      { message: "Credenciales inválidas" },
      { status: 401 }
    );
  }

  const token = await signToken({
    userId: user.id,
    role: "admin",
  });

  const response = NextResponse.json({ success: true });

  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: false,
    path: "/",
  });

  return response;
}
