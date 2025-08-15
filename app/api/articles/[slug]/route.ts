import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const { slug } = await ctx.params; // ✅ wajib await
  const row = await prisma.article.findUnique({
    where: { slug },
    include: { author: { select: { id: true, full_name: true, email: true } } },
  });
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}
