import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const active = url.searchParams.get("active");
    const where =
      active === null ? {} : { active: active === "true" || active === "1" };

    const rows = await prisma.vehicleCategory.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json(rows);
  } catch (e: any) {
    console.error("GET /api/vehicle_categories error:", e);
    return NextResponse.json(
      { message: e?.message ?? "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const row = await prisma.vehicleCategory.create({
      data: {
        name: body.name,
        active: body.active ?? true,
      },
    });

    return NextResponse.json(row, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/vehicle_categories error:", e);
    return NextResponse.json(
      { message: e?.message ?? "Failed to create category" },
      { status: 500 }
    );
  }
}
