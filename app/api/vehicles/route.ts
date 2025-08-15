import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") || undefined;

  const rows = await prisma.vehicle.findMany({
    where: status ? { status } : undefined,
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();

  // Terima keduanya: plateNumber (camel) atau plate_number (snake)
  const plate_number: string | undefined = body.plate_number ?? body.plateNumber;

  if (!plate_number || String(plate_number).trim() === "") {
    return NextResponse.json({ message: "plate_number wajib" }, { status: 400 });
  }

  const row = await prisma.vehicle.create({
    data: {
      plate_number,
      brand: body.brand ?? null,
      model: body.model ?? null,
      category: body.category ?? null,
      year: body.year != null ? Number(body.year) : null,
      status: body.status ?? "available",
    },
  });

  return NextResponse.json(row, { status: 201 });
}
