// app/artikel/[slug]/page.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cache } from "react";

/* ============================ Helpers ============================ */
function toDate(v: any): Date | null {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(+d) ? null : d;
}
function normalizeTags(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(String);
  if (typeof v === "string")
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

type ArticleRow = {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null; // snake_case di DB
  category: string | null;
  tags: any; // json/string/array
  status: string;
  published_at: Date | string | null;
  created_at?: Date | string | null;
  // author_id?: number | null;
  author?: { full_name: string | null } | null;
};

type ArticleView = {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImageUrl: string | null;
  category: string | null;
  tags: string[];
  publishedAt: Date | null;
  authorName: string | null; // fallback “Admin” saat render
};

function rowToView(a: ArticleRow): ArticleView {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    content: a.content ?? "",
    excerpt: a.excerpt ?? "",
    featuredImageUrl: a.featured_image_url ?? null,
    category: a.category ?? null,
    tags: normalizeTags(a.tags),
    publishedAt: toDate(a.published_at ?? a.created_at ?? null),
    authorName: a.author?.full_name ?? null,
  };
}

/* ============================ Data (cached) ============================ */
// Dedupe supaya generateMetadata & Page() tak double-hit DB
const getArticle = cache(async (slug: string) => {
  const a = await prisma.article.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      content: true,
      excerpt: true,
      featured_image_url: true,
      category: true,
      tags: true,
      status: true,
      published_at: true,
      created_at: true,
      author: { select: { full_name: true } },
    },
  });

  if (!a || a.status !== "published") return null;
  return rowToView(a as unknown as ArticleRow);
});

const getRelated = cache(async (slug: string, category: string | null) => {
  const where: any = { slug: { not: slug }, status: "published" };
  if (category) where.category = category;

  const rows = await prisma.article.findMany({
    where,
    orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
    take: 6,
    select: {
      id: true,
      slug: true,
      title: true,
      featured_image_url: true,
      published_at: true,
      created_at: true,
      status: true,
      category: true,
      tags: true,
      content: false,
      excerpt: false,
    },
  });

  return rows.map((r) =>
    rowToView(r as unknown as ArticleRow)
  ).slice(0, 3);
});

/* ============================ ISR / Prerender ============================ */
// Revalidate setiap 5 menit (production)
export const revalidate = 300;

// Pre-build sebagian slug (opsional; aman di dev/CI)
export async function generateStaticParams() {
  const rows = await prisma.article.findMany({
    where: { status: "published" },
    select: { slug: true },
    take: 1000,
  });
  return rows.map((r) => ({ slug: r.slug }));
}

/* ============================ Metadata ============================ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) {
    return { title: "Artikel tidak ditemukan - Padma Logistik Xpress" };
  }
  return {
    title: `${a.title} - Padma Logistik Xpress`,
    description: a.excerpt?.slice(0, 150) ?? "",
  };
}

/* ============================ Page ============================ */
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const related = await getRelated(article.slug, article.category);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* breadcrumb/back */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <Link href="/artikel">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Artikel
              </Button>
            </Link>
          </div>
        </section>

        {/* content */}
        <article className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                {article.category && (
                  <Badge className="capitalize mb-4">{article.category}</Badge>
                )}
                <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{article.authorName ?? "Admin"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {article.publishedAt
                        ? format(article.publishedAt, "dd MMMM yyyy", {
                            locale: idLocale,
                          })
                        : "-"}
                    </span>
                  </div>
                </div>

                {article.excerpt && (
                  <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                    {article.excerpt}
                  </p>
                )}
              </div>

              {article.featuredImageUrl && (
                <div className="mb-12">
                  <Image
                    src={article.featuredImageUrl}
                    alt={article.title}
                    width={1280}
                    height={720}
                    className="w-full h-auto rounded-lg shadow-lg"
                    priority
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none mb-12">
                <div
                  className="leading-relaxed text-foreground"
                  dangerouslySetInnerHTML={{
                    __html: (article.content || "").replace(/\n/g, "<br/>"),
                  }}
                />
              </div>

              {article.tags.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-lg font-semibold mb-4">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, i) => (
                      <Badge key={`${tag}-${i}`} variant="outline">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                  Artikel Terkait
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                  {related.map((rel) => (
                    <Card key={rel.id} className="overflow-hidden hover-lift">
                      <Link href={`/artikel/${rel.slug}`}>
                        <div className="aspect-video bg-muted relative">
                          {rel.featuredImageUrl ? (
                            <Image
                              src={rel.featuredImageUrl}
                              alt={rel.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                              <div className="text-4xl font-bold text-white/40">
                                {rel.title?.charAt(0)}
                              </div>
                            </div>
                          )}
                        </div>

                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                            {rel.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>
                              {rel.publishedAt
                                ? format(rel.publishedAt, "dd MMM yyyy", {
                                    locale: idLocale,
                                  })
                                : "-"}
                            </span>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
