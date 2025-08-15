// JANGAN pakai "use client" di file ini (biarkan server component)
import ArticleDetail from "@/src/pages/ArticleDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ✅ wajib await di Next 15
  return <ArticleDetail slug={slug} />; // ArticleDetail adalah client component
}
