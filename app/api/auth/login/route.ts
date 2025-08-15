import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, setSessionCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ message: "email & password wajib" }, { status: 400 });

  const user = await prisma.profile.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ message: "Email tidak ditemukan" }, { status: 404 });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return NextResponse.json({ message: "Password salah" }, { status: 401 });

  const token = await createSession({ uid: user.id, email: user.email, role: user.role });
  await setSessionCookie(token);

  return NextResponse.json({ user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } });
}
