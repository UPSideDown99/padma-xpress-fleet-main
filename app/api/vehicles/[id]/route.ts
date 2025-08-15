import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Ctx = { params: { id: string } };

export async function GET(_: Request, { params }: Ctx) {
  const id = Number(params.id);
  const row = await prisma.vehicle.findUnique({ where: { id } });
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(req: Request, { params }: Ctx) {
  const id = Number(params.id);
  const body = await req.json();

  // siapkan payload hanya field yang dikirim
  const data: any = {};
  if (body.plate_number != null || body.plateNumber != null) {
    data.plate_number = body.plate_number ?? body.plateNumber;
  }
  if (body.brand != null) data.brand = body.brand;
  if (body.model != null) data.model = body.model;
  if (body.category != null) data.category = body.category;
  if (body.year != null) data.year = Number(body.year);
  if (body.status != null) data.status = body.status;

  const row = await prisma.vehicle.update({ where: { id }, data });
  return NextResponse.json(row);
}

export async function DELETE(_: Request, { params }: Ctx) {
  const id = Number(params.id);
  await prisma.vehicle.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
