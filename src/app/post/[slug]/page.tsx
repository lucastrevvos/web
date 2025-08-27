import { apiFetch } from "@/lib/api";

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const list = await apiFetch(`/posts?slug=${encodeURIComponent(params.slug)}`);
  const post = Array.isArray(list) ? list[0] : list;

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-x1 font-semibold">Post não encontrado</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-3x1 font-bold tracking-tight">{post.title}</h1>
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt=""
          className="mb-6 w-full rounded-lg border border-slate-200"
        />
      )}
      <article className="prose prose-slate max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
      </article>
    </main>
  );
}
