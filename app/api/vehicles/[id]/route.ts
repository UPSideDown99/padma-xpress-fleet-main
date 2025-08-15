import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Ctx = { params: { id: string } };

export async function GET(_: Request, { params }: Ctx) {
  const idNum = Number(params.id);
  if (Number.isNaN(idNum)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const row = await prisma.vehicle.findFirst({
    where: { id: idNum },
    include: { VehicleCategory: true },
  });

  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const shaped = {
    ...row,
    category: row.VehicleCategory
      ? { id: row.VehicleCategory.id, name: row.VehicleCategory.name, active: row.VehicleCategory.active }
      : null,
  };

  return NextResponse.json(shaped);
}

export async function PUT(req: Request, { params }: Ctx) {
  const idNum = Number(params.id);
  if (Number.isNaN(idNum)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const body = await req.json();

  const data: any = {};
  if (body.plate_number != null || body.plateNumber != null) {
    data.plate_number = body.plate_number ?? body.plateNumber;
  }
  if (body.brand != null) data.brand = body.brand;
  if (body.model != null) data.model = body.model;
  if (body.category != null) data.category = body.category; // scalar string (kalau ada)
  if (body.year != null) data.year = Number(body.year);
  if (body.status != null) data.status = body.status;
  // kalau pakai FK: if (body.category_id != null) data.category_id = Number(body.category_id);

  await prisma.vehicle.updateMany({ where: { id: idNum }, data });

  const updated = await prisma.vehicle.findFirst({
    where: { id: idNum },
    include: { VehicleCategory: true },
  });

  if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const shaped = {
    ...updated,
    category: updated.VehicleCategory
      ? { id: updated.VehicleCategory.id, name: updated.VehicleCategory.name, active: updated.VehicleCategory.active }
      : null,
  };

  return NextResponse.json(shaped);
}

export async function DELETE(_: Request, { params }: Ctx) {
  const idNum = Number(params.id);
  if (Number.isNaN(idNum)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  await prisma.vehicle.deleteMany({ where: { id: idNum } });
  return NextResponse.json({ ok: true });
}
