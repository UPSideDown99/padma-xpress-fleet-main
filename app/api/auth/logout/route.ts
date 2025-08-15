// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

const COOKIE = "session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // hapus cookie session
  res.cookies.set(COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  return res;
}

// optional GET biar bisa di-trigger via fetch GET kalau perlu
export async function GET() {
  return POST();
}
