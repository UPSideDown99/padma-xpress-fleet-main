import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const active = url.searchParams.get("active");
  const where =
    active === null
      ? {}
      : { active: active === "true" || active === "1" };

  const rows = await prisma.vehicleCategory.findMany({
    where,
    orderBy: { name: "asc" },
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const row = await prisma.vehicleCategory.create({
    data: {
      name: body.name,
      active: body.active ?? true,
    },
  });
  return NextResponse.json(row, { status: 201 });
}
