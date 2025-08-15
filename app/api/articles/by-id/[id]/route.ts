import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const { id } = await ctx.params; // ✅
  const row = await prisma.article.findUnique({
    where: { id: Number(id) },
    include: { author: { select: { id: true, full_name: true, email: true } } },
  });
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params; // ✅
  const body = await req.json();

  const updated = await prisma.article.update({
    where: { id: Number(id) },
    data: {
      slug: body.slug ?? undefined,
      title: body.title ?? undefined,
      content: body.content ?? undefined,
      excerpt: body.excerpt ?? undefined,
      featured_image_url: body.featured_image_url ?? undefined,
      status: body.status ?? undefined,
      category: body.category ?? undefined,
      tags: body.tags ?? undefined,
      published_at: body.published_at ?? undefined,
      author_id: body.author_id ?? undefined,
    },
    include: { author: { select: { id: true, full_name: true, email: true } } },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, ctx: Ctx) {
  const { id } = await ctx.params; // ✅
  await prisma.article.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
