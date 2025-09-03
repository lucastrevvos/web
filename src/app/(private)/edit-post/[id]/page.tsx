import { apiFetch } from "@/lib/api";
import { deletePostAction, updatePostAction } from "./actions";

type PageProps = { params: { id: string } };

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;

  const [post, categories, tags] = await Promise.all([
    apiFetch(`/posts/${id}`),
    apiFetch(`/categories/`),
    apiFetch(`/tags/`),
  ]);

  const selectedCategoryIds = new Set<string>(
    (post.categories ?? [])
      .map((pc: any) => pc.categoryId ?? pc?.category?.id)
      .filter(Boolean)
  );

  const selectedTagIds = new Set<string>(
    (post.tags ?? []).map((pt: any) => pt.tagId ?? pt?.tag?.id).filter(Boolean)
  );

  //form action encapada para passar o id
  async function action(formData: FormData) {
    "use server";
    return updatePostAction(id, formData);
  }

  async function deleteAction() {
    "use server";
    await deletePostAction(id);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Editar Post</h1>

      <form action={action} className="grid gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Slug
          </label>
          <input
            name="slug"
            defaultValue={post.slug}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Título
          </label>
          <input
            name="title"
            defaultValue={post.title}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Resumo
          </label>
          <textarea
            name="excerpt"
            rows={3}
            defaultValue={post.excerpt ?? ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          ></textarea>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Conteúdo
          </label>
          <textarea
            name="content"
            rows={3}
            defaultValue={post.content ?? ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          ></textarea>
        </div>

        <fieldset className="rounded-md border border-slate-200 p-3">
          <legend className="px-1 text-sm font-medium text-slate-700">
            Categorias
          </legend>
          <div className="mt-2 grid-cols-2 gap-2 md:grid-cols-3">
            {categories.map((c: any) => (
              <label key={c.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="categoryIds"
                  value={c.id}
                  defaultChecked={selectedCategoryIds.has(c.id)}
                  className="h-4 w-4"
                />
                <span>{c.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-md border border-slate-200 p-3">
          <legend className="px-1 text-sm font-medium text-slate-700">
            Tags
          </legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {tags.map((t: any) => (
              <label
                key={t.id}
                className="inline-flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  name="tagIds"
                  value={t.id}
                  defaultChecked={selectedTagIds.has(t.id)}
                  className="h-4 w-4"
                />
                <span>#{t.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-2 flex items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-500"
          >
            Salvar alterações
          </button>
        </div>
      </form>

      <form action={deleteAction} className="mt-3 inline-block">
        <button className="rounded-md border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
          Excluir
        </button>
      </form>
    </main>
  );
}
