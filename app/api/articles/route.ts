import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const hasParams =
    url.searchParams.has("page") ||
    url.searchParams.has("limit") ||
    url.searchParams.has("q") ||
    url.searchParams.has("status") ||
    url.searchParams.has("category");

  // MODE LAMA (BACKWARD-COMPATIBLE): tanpa query → kembalikan array
  if (!hasParams) {
    const rows = await prisma.article.findMany({
      orderBy: { created_at: "desc" },
      include: { author: { select: { id: true, full_name: true, email: true } } },
    });
    return NextResponse.json(rows);
  }

  // MODE BARU: dengan query → kembalikan {page,limit,total,data}
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || 20)));
  const skip = (page - 1) * limit;

  const status = url.searchParams.get("status") || undefined; // "published" | "draft" | ...
  const q = (url.searchParams.get("q") || "").trim();
  const category = url.searchParams.get("category") || undefined;

  const where: any = {};
  if (status) where.status = status;
  if (category && category !== "all") where.category = category;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
      { content: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, rows] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      orderBy: { created_at: "desc" },
      include: { author: { select: { id: true, full_name: true, email: true } } },
      skip,
      take: limit,
    }),
  ]);

  return NextResponse.json({ page, limit, total, data: rows });
}

export async function POST(req: Request) {
  const body = await req.json();
  const sess = await getSession();

  const created = await prisma.article.create({
    data: {
      slug: body.slug,
      title: body.title,
      content: body.content ?? "",
      excerpt: body.excerpt ?? null,
      featured_image_url: body.featured_image_url ?? null,
      status: body.status ?? "draft",
      category: body.category ?? null,
      tags: body.tags ?? null,
      published_at: body.status === "published" ? new Date() : null,
      author_id: body.author_id ?? sess?.uid ?? null,
    },
    include: { author: { select: { id: true, full_name: true, email: true } } },
  });

  return NextResponse.json(created, { status: 201 });
}
