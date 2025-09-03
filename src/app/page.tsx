import { Sidebar } from "@/components/sidebar";
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
      <section className="grid gap-8 lg:grid-cols-[1fr,18rem]">
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
        <Sidebar />
      </section>
    </main>
  );
}
