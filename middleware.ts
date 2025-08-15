import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "session"; // pastikan sama dengan yang diset di /api/auth/login

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Jaga hanya /admin
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Ambil token dari cookie
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  // Belum login → lempar ke /auth dengan redirect
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("redirect", pathname + (search || ""));
    return NextResponse.redirect(url);
  }

  // Sudah ada token → verifikasi
  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret");
    const { payload } = await jwtVerify(token, secret); // payload diharapkan { uid, email, role, ... }

    // Batasi role
    const role = (payload as any)?.role;
    if (role && role !== "admin") {
      // bukan admin → pulangkan ke beranda
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Lolos
    return NextResponse.next();
  } catch {
    // Token invalid/expired → kembali ke /auth dengan redirect
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("redirect", pathname + (search || ""));
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
