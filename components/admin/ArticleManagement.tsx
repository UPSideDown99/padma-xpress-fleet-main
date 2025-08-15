"use client";

import { useEffect, useState } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useSimpleAuth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  status: "draft" | "published" | "archived";
  category: string;
  tags: string[] | null;
  published_at: string | null;
  created_at: string;
  author?: { full_name: string | null } | null;
};

type ApiResp<T = any> = { ok: boolean; message?: string; data?: T } | T;

async function json<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  const body = (await res.json().catch(() => ({}))) as any;
  if (!res.ok) throw new Error(body?.message || `Request failed: ${res.status}`);
  return (body?.data ?? body) as T;
}

export default function ArticleManagement() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image_url: "",
    status: "draft" as Article["status"],
    category: "general",
    tags: "",
    published_at: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await json<Article[]>("/api/articles");
        setArticles(data);
      } catch (e: any) {
        toast({ variant: "destructive", title: "Error", description: e.message || "Failed to fetch articles" });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim();

  const resetForm = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featured_image_url: "",
      status: "draft",
      category: "general",
      tags: "",
      published_at: "",
    });
  };

  const handleNewArticle = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt ?? "",
      featured_image_url: article.featured_image_url ?? "",
      status: article.status,
      category: article.category,
      tags: (article.tags ?? []).join(", "),
      published_at: article.published_at
        ? format(new Date(article.published_at), "yyyy-MM-dd'T'HH:mm")
        : "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: Partial<Article> & { author_id?: number | string | null } = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        content: formData.content,
        excerpt: formData.excerpt || null,
        featured_image_url: formData.featured_image_url || null,
        status: formData.status,
        category: formData.category,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        published_at:
          formData.status === "published"
            ? (formData.published_at
                ? new Date(formData.published_at).toISOString()
                : new Date().toISOString())
            : null,
        // biarkan backend pakai sesi; kalau butuh, ini tersedia
        author_id: (user as any)?.id ?? null,
      };

      if (editingArticle) {
        await json(`/api/articles/by-id/${editingArticle.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast({ title: "Success", description: "Article updated successfully" });
      } else {
        await json("/api/articles", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast({ title: "Success", description: "Article created successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      // refresh list
      const data = await json<Article[]>("/api/articles");
      setArticles(data);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e?.message || "Failed to save article" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await json(`/api/articles/by-id/${id}`, { method: "DELETE" });
      toast({ title: "Success", description: "Article deleted successfully" });
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e?.message || "Failed to delete article" });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Article Management</h3>
          <p className="text-sm text-muted-foreground">Manage articles and news content</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewArticle}>
              <Plus className="w-4 h-4 mr-2" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingArticle ? "Edit Article" : "Add New Article"}</DialogTitle>
              <DialogDescription>
                {editingArticle ? "Update article information" : "Create a new article"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((s) => ({
                        ...s,
                        title: e.target.value,
                        slug: generateSlug(e.target.value),
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((s) => ({ ...s, slug: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData((s) => ({ ...s, excerpt: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData((s) => ({ ...s, content: e.target.value }))}
                  rows={10}
                  required
                />
              </div>

              <div>
                <Label htmlFor="featured_image_url">Featured Image URL</Label>
                <Input
                  id="featured_image_url"
                  type="url"
                  value={formData.featured_image_url}
                  onChange={(e) => setFormData((s) => ({ ...s, featured_image_url: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((s) => ({ ...s, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="logistics">Logistics</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Article["status"]) =>
                      setFormData((s) => ({ ...s, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData((s) => ({ ...s, tags: e.target.value }))}
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              {formData.status === "published" && (
                <div>
                  <Label htmlFor="published_at">Published Date</Label>
                  <Input
                    id="published_at"
                    type="datetime-local"
                    value={formData.published_at}
                    onChange={(e) => setFormData((s) => ({ ...s, published_at: e.target.value }))}
                  />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingArticle ? "Update" : "Create"} Article</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
          <CardDescription>{articles.length} article(s) total</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{article.title}</div>
                      <div className="text-sm text-muted-foreground">/{article.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {article.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        article.status === "published"
                          ? "default"
                          : article.status === "draft"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {article.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{article.author?.full_name || "Unknown"}</TableCell>
                  <TableCell>
                    {article.published_at ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(article.published_at), "dd MMM yyyy", { locale: idLocale })}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not published</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {article.status === "published" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/artikel/${article.slug}`, "_blank")}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(article)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(article.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {articles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No articles found. Create your first article to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
