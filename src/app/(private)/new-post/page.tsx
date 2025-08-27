import { createPostAction } from "./actions";

export default function NewPostPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2x1 font-semibold">Novo Post</h1>

      <form action={createPostAction} className="grid gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Slug
          </label>
          <input
            name="slug"
            placeholder="slug-exemplo"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Titulo
          </label>
          <input
            name="title"
            placeholder="Título"
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
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Conteúdo
          </label>
          <textarea
            name="content"
            rows={10}
            placeholder="Markdown ou HTML"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <button
          type="submit"
          className="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Salvar
        </button>
      </form>
    </main>
  );
}
