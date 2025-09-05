// apps/web/src/app/(private)/edit-post/[id]/page.tsx
export const dynamic = "force-dynamic";

import { apiFetch } from "@/lib/api";
import { cookies } from "next/headers";
import EditPostForm from "./EditPostForm";

type PageProps = { params: { id: string } };

export default async function EditPostPage({ params }: PageProps) {
  const id = (await params).id;

  const [post, categories, tags] = await Promise.all([
    apiFetch(`/posts/${id}`),
    apiFetch(`/categories`),
    apiFetch(`/tags`),
  ]);

  // mapeia relações para arrays simples de ids
  const initialCategoryIds: string[] = (post.categories ?? [])
    .map((pc: any) => pc.categoryId ?? pc?.category?.id)
    .filter(Boolean);

  const initialTagIds: string[] = (post.tags ?? [])
    .map((pt: any) => pt.tagId ?? pt?.tag?.id)
    .filter(Boolean);

  const token = (await cookies()).get("accessToken")?.value;

  const initialValues = {
    slug: post.slug as string,
    title: post.title as string,
    excerpt: (post.excerpt ?? "") as string,
    content: (post.content ?? "") as string,
    categoryIds: initialCategoryIds,
    tagIds: initialTagIds,
    status: (post.status as "DRAFT" | "PUBLISHED") ?? "DRAFT",
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Editar Post</h1>
      <EditPostForm
        postId={id}
        initialValues={initialValues}
        categories={categories}
        tags={tags}
        accessToken={token}
      />
    </main>
  );
}
