import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const rows = await prisma.article.findMany({
    orderBy: { created_at: "desc" },
    include: { author: { select: { id: true, full_name: true, email: true } } },
  });
  return NextResponse.json(rows);
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
