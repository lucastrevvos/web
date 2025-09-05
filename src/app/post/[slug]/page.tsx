import { MarkdownView } from "@/components/MarkdownView";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

type Props = { params: Promise<{ slug: string }> };

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const [list, token] = await Promise.all([
    apiFetch(`/posts?slug=${encodeURIComponent(slug)}`),
    getAccessToken(),
  ]);

  const post = Array.isArray(list) ? list[0] : list;

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-x1 font-semibold">Post não encontrado</h1>
      </main>
    );
  }

  const categories = (post.categories ?? []).map((pc: any) => pc.category);
  const tags = (post.tags ?? []).map((pt: any) => pt.tag);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="mb-4 text-3x1 font-bold tracking-tight">{post.title}</h1>
        {token && (
          <a
            href={`/edit-post/${post.id}`}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
          >
            Editar
          </a>
        )}
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        {categories.map((c: any) => (
          <a
            key={c.id}
            href={`/categoria/${c.slug}`}
            className="rounded bg-slate-100 px-2 py-1 hover:bg-slate-200"
          >
            {c.name}
          </a>
        ))}

        {tags.map((t: any) => (
          <a
            key={t.id}
            href={`/tag/${t.slug}`}
            className="rounded border bg-slate-200 px-2 py-1 text-slate-700 hover:bg-slate-50"
          >
            #{t.name}
          </a>
        ))}
      </div>
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt=""
          className="mb-6 w-full rounded-lg border border-slate-200"
        />
      )}
      <article className="prose prose-slate max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.excerpt }}></div>
      </article>
      <article className="prose prose-slate max-w-none">
        <MarkdownView markdown={post.content || ""} />
      </article>
    </main>
  );
}
