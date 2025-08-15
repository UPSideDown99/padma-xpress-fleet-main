import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const sess = await getSession();
  if (!sess) return NextResponse.json({ user: null });
  const profile = await prisma.profile.findUnique({ where: { id: sess.uid } });
  return NextResponse.json({
    user: profile ? { id: profile.id, email: profile.email, full_name: profile.full_name, role: profile.role } : null,
    profile
  });
}
