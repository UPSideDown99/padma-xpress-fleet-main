"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, ArrowLeft, Share2, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

type Article = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  category: string | null;
  tags: string[] | null;
  published_at: string | null;
  author: { full_name: string | null } | null;
};

export default function ArticleDetail({ slug }: { slug: string }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const run = async () => {
      try {
        // detail by slug, status published
        const { data, error } = await supabase
          .from("articles")
          .select(`
            *,
            author:profiles(full_name)
          `)
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle();

        if (error) throw error;

        const art = (data as unknown as Article) || null;
        setArticle(art);

        // related: published + same category, exclude current, max 3
        if (art?.category) {
          const rel = await supabase
            .from("articles")
            .select(`
              *,
              author:profiles(full_name)
            `)
            .eq("status", "published")
            .eq("category", art.category)
            .order("published_at", { ascending: false })
            .limit(6); // ambil agak banyak, nanti di-filter

          const list = ((rel.data as unknown as Article[]) || [])
            .filter((x) => x.id !== art.id)
            .slice(0, 3);

          setRelatedArticles(list);
        } else {
          setRelatedArticles([]);
        }
      } catch (e) {
        console.error("Error fetching article:", e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [slug]);

  const handleShare = () => {
    if (!article) return;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt || "",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: tampilkan toast jika mau
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 container mx-auto px-4">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
            <p className="text-muted-foreground mb-8">
              Artikel yang Anda cari tidak ditemukan atau telah dihapus.
            </p>
            <Link href="/artikel">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Artikel
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
                    <span>{article.author?.full_name || "Admin"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {article.published_at
                        ? format(new Date(article.published_at), "dd MMMM yyyy", {
                            locale: idLocale,
                          })
                        : "-"}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Bagikan
                  </Button>
                </div>

                {article.excerpt && (
                  <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                    {article.excerpt}
                  </p>
                )}
              </div>

              {article.featured_image_url && (
                <div className="mb-12">
                  <img
                    src={article.featured_image_url}
                    alt={article.title}
                    className="w-full rounded-lg shadow-lg"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none mb-12">
                <div
                  className="leading-relaxed text-foreground"
                  // kalau content HTML
                  dangerouslySetInnerHTML={{
                    __html: (article.content || "").replace(/\n/g, "<br/>"),
                  }}
                />
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-lg font-semibold mb-4">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, i) => (
                      <Badge key={i} variant="outline">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>

        {relatedArticles.length > 0 && (
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                  Artikel Terkait
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                  {relatedArticles.map((rel) => (
                    <Card key={rel.id} className="overflow-hidden hover-lift">
                      <Link href={`/artikel/${rel.slug}`}>
                        <div className="aspect-video bg-muted">
                          {rel.featured_image_url ? (
                            <img
                              src={rel.featured_image_url}
                              alt={rel.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
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
                              {rel.published_at
                                ? format(new Date(rel.published_at), "dd MMM yyyy", {
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
