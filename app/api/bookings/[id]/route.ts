import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
type Ctx = { params: { id: string} };

export async function GET(_: Request, { params }: Ctx) {
  const row = await prisma.booking.findUnique({ where: { id: Number(params.id) } });
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(req: Request, { params }: Ctx) {
  const b = await req.json();
  const updated = await prisma.booking.update({
    where: { id: Number(params.id) },
    data: {
      booking_type: b.booking_type ?? undefined,
      vehicle_selection: b.vehicle_selection ?? undefined,
      pickup_location: b.pickup_location ?? undefined,
      destination: b.destination ?? undefined,
      pickup_datetime: b.pickup_datetime ? new Date(b.pickup_datetime) : undefined,
      return_datetime: b.return_datetime ? new Date(b.return_datetime) : undefined,
      service_type: b.service_type ?? undefined,
      sender_name: b.sender_name ?? undefined,
      sender_phone: b.sender_phone ?? undefined,
      sender_address: b.sender_address ?? undefined,
      recipient_name: b.recipient_name ?? undefined,
      recipient_phone: b.recipient_phone ?? undefined,
      recipient_address: b.recipient_address ?? undefined,
      package_weight: b.package_weight ?? undefined,
      package_description: b.package_description ?? undefined,
      special_instructions: b.special_instructions ?? undefined,
      notes: b.notes ?? undefined,
      total_price: b.total_price ?? undefined,
      booking_status: b.booking_status ?? undefined,
      payment_status: b.payment_status ?? undefined,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Ctx) {
  await prisma.booking.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
