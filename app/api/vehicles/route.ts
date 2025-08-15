import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || undefined;

    const rows = await prisma.vehicle.findMany({
      where: status ? { status } : undefined,
      orderBy: { created_at: "desc" },
      // >>> pakai nama relasi yang benar
      include: { VehicleCategory: true },
    });

    // Bentuk ulang agar FE tetap bisa akses "category"
    const shaped = rows.map(({ VehicleCategory, ...v }) => ({
      ...v,
      category: VehicleCategory
        ? { id: VehicleCategory.id, name: VehicleCategory.name, active: VehicleCategory.active }
        : null,
    }));

    return NextResponse.json(shaped);
  } catch (e: any) {
    console.error("GET /api/vehicles error:", e);
    return NextResponse.json(
      { message: e?.message ?? "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Terima plateNumber / plate_number
    const plate_number: string | undefined = body.plate_number ?? body.plateNumber;
    if (!plate_number || String(plate_number).trim() === "") {
      return NextResponse.json({ message: "plate_number wajib" }, { status: 400 });
    }

    const created = await prisma.vehicle.create({
      data: {
        plate_number,
        brand: body.brand ?? null,
        model: body.model ?? null,
        // kolom scalar di tabel vehicle (kalau ada)
        category: body.category ?? null,
        year: body.year != null ? Number(body.year) : null,
        status: body.status ?? "available",
        // kalau kamu punya FK category_id di Vehicle dan ingin set relasi,
        // tambahkan di sini: category_id: body.category_id
      },
      include: { VehicleCategory: true },
    });

    const shaped = {
      ...created,
      category: created.VehicleCategory
        ? { id: created.VehicleCategory.id, name: created.VehicleCategory.name, active: created.VehicleCategory.active }
        : null,
    };

    return NextResponse.json(shaped, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/vehicles error:", e);
    return NextResponse.json(
      { message: e?.message ?? "Failed to create vehicle" },
      { status: 500 }
    );
  }
}
