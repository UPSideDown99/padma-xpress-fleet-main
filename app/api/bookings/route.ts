import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const rows = await prisma.booking.findMany({
    orderBy: { created_at: "desc" },
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const b = await req.json();
  const sess = await getSession();

  const created = await prisma.booking.create({
    data: {
      user_id: b.user_id ?? sess?.uid ?? null,
      booking_type: b.booking_type,
      vehicle_selection: b.vehicle_selection ?? null,
      pickup_location: b.pickup_location ?? null,
      destination: b.destination ?? null,
      pickup_datetime: b.pickup_datetime ? new Date(b.pickup_datetime) : null,
      return_datetime: b.return_datetime ? new Date(b.return_datetime) : null,
      service_type: b.service_type ?? null,
      sender_name: b.sender_name ?? null,
      sender_phone: b.sender_phone ?? null,
      sender_address: b.sender_address ?? null,
      recipient_name: b.recipient_name ?? null,
      recipient_phone: b.recipient_phone ?? null,
      recipient_address: b.recipient_address ?? null,
      package_weight: b.package_weight ?? null,
      package_description: b.package_description ?? null,
      special_instructions: b.special_instructions ?? null,
      notes: b.notes ?? null,
      total_price: b.total_price ?? null,
      booking_status: b.booking_status ?? "pending",
      payment_status: b.payment_status ?? "pending",
    },
  });

  return NextResponse.json(created, { status: 201 });
}
