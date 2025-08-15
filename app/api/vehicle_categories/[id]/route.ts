import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Ctx = { params: { id: string } };

export async function GET(_: Request, { params }: Ctx) {
  const idNum = Number(params.id);
  if (Number.isNaN(idNum)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const row = await prisma.vehicleCategory.findFirst({
    where: { id: idNum },
  });

  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(req: Request, { params }: Ctx) {
  const idNum = Number(params.id);
  if (Number.isNaN(idNum)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const body = await req.json();

  await prisma.vehicleCategory.updateMany({
    where: { id: idNum },
    data: {
      name: body.name ?? undefined,
      active: body.active ?? undefined,
    },
  });

  const updated = await prisma.vehicleCategory.findFirst({ where: { id: idNum } });
  if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Ctx) {
  const idNum = Number(params.id);
  if (Number.isNaN(idNum)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  await prisma.vehicleCategory.deleteMany({ where: { id: idNum } });
  return NextResponse.json({ ok: true });
}
