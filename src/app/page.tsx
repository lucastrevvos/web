import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string | null;
};

export default async function Home() {
  const token = await getAccessToken();
  const posts = await apiFetch("/posts?status=PUBLISHED&take=20", {
    accessToken: token,
  });

  return (
    <main className="mx-auto max-w-5x1 px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2x1 font-bold tracking-tight">Trevvos</h1>
        <nav className="space-x-3">
          <a
            href="/(public)/login"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Entrar
          </a>
          <a
            href="/(private)/new-post"
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Novo Post
          </a>
        </nav>
      </header>

      <section className="grid gap-4">
        {posts.map((p: Post) => (
          <article
            key={p.id}
            className="rounded-lg border border-slate-200 p-5 hover: hover:shadow-sm transition"
          >
            <a href={`/post/${p.slug}`} className="no-underline">
              <h3 className="mb-2 text-lg font-semibold text-slate-900 hover:underline">
                {p.title}
              </h3>
            </a>
            {p.excerpt && (
              <p className="text-sm learding-relaxed text-slate-600">
                {p.excerpt}
              </p>
            )}
            {p.publishedAt && (
              <p className="mt-2 text-xs text-slate-500">
                Publicado {new Date(p.publishedAt).toLocaleDateString()}
              </p>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
