import { apiFetch } from "@/lib/api";

export async function Sidebar() {
  const [cats, tags] = await Promise.all([
    apiFetch("/categories"),
    apiFetch("/tags"),
  ]);

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="rounded-lg border border-slate-200 p-4">
        <h3 className="mb-2 text-sm font-semibold">Categorias</h3>
        <ul className="space-y-1">
          {cats.map((c: any) => (
            <li key={c.id}>
              <a href={`/categoria/${c.slug}`}>{c.name}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 rounded-lg border border-slate-200 p-4">
        <h3 className="mb-2 text-sm font-semibold">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((t: any) => (
            <a
              key={t.id}
              href={`/tag/${t.slug}`}
              className="text-xs rounded bg-slate-100 px-2 py-1 hover:bg-slate-200"
            >
              #{t.name}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
