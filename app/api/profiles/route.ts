import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  const rows = await prisma.profile.findMany({
    orderBy: { created_at: "desc" },
    select: {
      id: true, email: true, full_name: true, phone: true, company_name: true,
      role: true, created_at: true, updated_at: true
    }
  });
  return NextResponse.json(rows);
}

// Optional: buat user (admin only – belum pakai guard)
// email & password wajib
export async function POST(req: Request) {
  const b = await req.json();
  if (!b.email || !b.password) {
    return NextResponse.json({ message: "email & password wajib" }, { status: 400 });
  }
  const exist = await prisma.profile.findUnique({ where: { email: b.email } });
  if (exist) return NextResponse.json({ message: "Email already used" }, { status: 409 });

  const password_hash = await bcrypt.hash(b.password, 10);
  const created = await prisma.profile.create({
    data: {
      email: b.email,
      password_hash,
      full_name: b.full_name ?? null,
      phone: b.phone ?? null,
      company_name: b.company_name ?? null,
      role: b.role ?? "customer",
    },
    select: { id: true, email: true, full_name: true, role: true }
  });
  return NextResponse.json(created, { status: 201 });
}
