import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Ctx = { params: { id: string } };

export async function GET(_: Request, { params }: Ctx) {
  const row = await prisma.vehicleCategory.findUnique({
    where: { id: Number(params.id) },
  });
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(req: Request, { params }: Ctx) {
  const body = await req.json();
  const row = await prisma.vehicleCategory.update({
    where: { id: Number(params.id) },
    data: {
      name: body.name ?? undefined,
      active: body.active ?? undefined,
    },
  });
  return NextResponse.json(row);
}

export async function DELETE(_: Request, { params }: Ctx) {
  await prisma.vehicleCategory.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
