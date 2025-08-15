// app/artikel/page.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, User, Search, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export const revalidate = 300; // ISR 5 menit

type SearchParams = Promise<{ q?: string; category?: string; page?: string; limit?: string }>;

type ArticleRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image_url: string | null;
  category: string | null;
  tags: unknown; // Json di DB, bisa string[] | string | null
  published_at: Date | string | null;
  created_at?: Date | string | null;
};

function safeDate(v: unknown): Date {
  const d = new Date(v as any);
  return isNaN(+d) ? new Date() : d;
}

function toInt(v: string | undefined, d: number, max?: number) {
  const n = Number(v);
  const ok = Number.isFinite(n) && n > 0 ? Math.floor(n) : d;
  return max ? Math.min(ok, max) : ok;
}

function normalizeTags(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(String);
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String);
    } catch {
      // not JSON, treat as comma-separated
    }
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  // WAJIB: await di Next 15+
  const sp = await searchParams;
  const q = (sp.q ?? "").toString().trim();
  const category = (sp.category ?? "all").toString();
  const page = toInt(sp.page, 1);
  const limit = toInt(sp.limit, 9, 30);
  const skip = (page - 1) * limit;

  // server-side filter
  const where: any = { status: "published" };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
      { content: { contains: q, mode: "insensitive" } },
    ];
  }
  if (category && category !== "all") where.category = category;

  const [total, rows] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
      skip,
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        featured_image_url: true,
        category: true,
        tags: true,
        published_at: true,
        created_at: true,
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const categories = [
    { label: "Semua Kategori", value: "all" },
    { label: "Berita", value: "news" },
    { label: "Tips", value: "tips" },
    { label: "Perusahaan", value: "company" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 bg-gradient-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Artikel & Insight</h1>
              <p className="text-white/90">
                Update terkini seputar layanan, tips logistik & transportasi, serta aktivitas perusahaan.
              </p>
            </div>
          </div>
        </section>

        {/* Search + Filter (GET form → update URL, tanpa JS tambahan) */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto" method="get">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input name="q" placeholder="Cari artikel..." defaultValue={q} className="pl-10" />
              </div>

              {/* pakai <select> native supaya ikut terkirim saat submit */}
              <select
                name="category"
                defaultValue={category}
                className="w-full md:w-48 h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>

              {/* simpan page=1 saat mengganti filter */}
              <input type="hidden" name="page" value="1" />
              <input type="hidden" name="limit" value={String(limit)} />

              {/* tombol submit tersamar, submit terjadi saat user tekan Enter */}
              <button className="hidden" type="submit" />
            </form>
          </div>
        </section>

        {/* List */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {rows.length === 0 ? (
              <div className="text-center text-muted-foreground">Tidak ada artikel.</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rows.map((article) => {
                  const tags = normalizeTags(article.tags);
                  return (
                    <Card key={article.id} className="hover-lift overflow-hidden">
                      <Link href={`/artikel/${article.slug}`}>
                        <CardHeader className="p-0">
                          <div className="relative h-48 bg-muted">
                            {article.featured_image_url ? (
                              <Image
                                src={article.featured_image_url}
                                alt={article.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority={false}
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                <Clock className="w-6 h-6 mr-2" />
                                <span>No Image</span>
                              </div>
                            )}
                            <div className="absolute left-4 top-4">
                              {article.category && <Badge>{article.category}</Badge>}
                            </div>
                          </div>

                          <div className="p-6">
                            <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                            {article.excerpt && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                                {article.excerpt}
                              </p>
                            )}
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>Admin</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {format(
                                  safeDate(article.published_at ?? article.created_at),
                                  "dd MMM yyyy",
                                  { locale: idLocale }
                                )}
                              </span>
                            </div>
                          </div>

                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {tags.slice(0, 3).map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const active = p === page;
                  const usp = new URLSearchParams();
                  usp.set("page", String(p));
                  usp.set("limit", String(limit));
                  if (q) usp.set("q", q);
                  if (category && category !== "all") usp.set("category", category);

                  return (
                    <Link key={p} href={`/artikel?${usp.toString()}`}>
                      <span
                        className={`px-3 py-1 rounded border ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        {p}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
