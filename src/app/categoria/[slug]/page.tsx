import { apiFetch } from "@/lib/api";

type Props = { params: { slug: string } };

export default async function CategoriaPage({ params }: Props) {
  const cat = await apiFetch(`/categories/${params.slug}`);
  const posts = await apiFetch(`/posts?categoryId=${cat.id}&status=PUBLISHED`);

  return (
    <main>
      <h1>
        <section>
          {posts.map((p: any) => (
            <article key={p.id}>
              <a href={`/post/${p.slug}`}>
                <h3>{p.title}</h3>
              </a>
              {p.excerpt && <p>{p.excerpt}</p>}
            </article>
          ))}
        </section>
      </h1>
    </main>
  );
}
