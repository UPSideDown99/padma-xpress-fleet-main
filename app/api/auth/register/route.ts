import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, setSessionCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password, full_name, role } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: "email & password wajib" }, { status: 400 });
  }

  const exist = await prisma.profile.findUnique({ where: { email } });
  if (exist) return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 409 });

  const password_hash = await bcrypt.hash(password, 10);
  const user = await prisma.profile.create({
    data: { email, password_hash, full_name: full_name ?? null, role: role ?? "customer" }
  });

  const token = await createSession({ uid: user.id, email: user.email, role: user.role });
  await setSessionCookie(token);

  return NextResponse.json({ user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } }, { status: 201 });
}
