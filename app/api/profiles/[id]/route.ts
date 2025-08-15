import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
type Ctx = { params: { id: string } };

export async function GET(_: Request, { params }: Ctx) {
  const row = await prisma.profile.findUnique({
    where: { id: params.id },
    select: {
      id:true, email:true, full_name:true, phone:true, company_name:true,
      address:true, city:true, role:true, created_at:true, updated_at:true
    }
  });
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(req: Request, { params }: Ctx) {
  const b = await req.json();
  const updated = await prisma.profile.update({
    where: { id: params.id },
    data: {
      email: b.email ?? undefined,
      full_name: b.full_name ?? undefined,
      phone: b.phone ?? undefined,
      company_name: b.company_name ?? undefined,
      address: b.address ?? undefined,
      city: b.city ?? undefined,
      role: b.role ?? undefined,
    },
    select: { id:true, email:true, full_name:true, role:true }
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Ctx) {
  await prisma.profile.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
