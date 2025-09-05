"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { PostFormSchema } from "./schema";
import { apiFetch, ApiError } from "@/lib/api";

type FormInput = z.input<typeof PostFormSchema>;

export default function NewPostForm({
  categories,
  tags,
  accessToken,
}: {
  categories: any[];
  tags: any[];
  accessToken: string | undefined;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<FormInput>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      categoryIds: [],
      tagIds: [],
      intent: "save",
    },
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [debug, setDebug] = useState<any>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    //console.log("[NewPostForm] hydrated");
  }, []);

  const onSubmit = async (values: FormInput) => {
    setFormError(null);
    setDebug(null);

    const parsed = PostFormSchema.parse(values);

    try {
      const res = await apiFetch("/posts", {
        method: "POST",
        accessToken,
        body: {
          slug: parsed.slug,
          title: parsed.title,
          excerpt: parsed.excerpt,
          content: parsed.content,
          categoryIds: parsed.categoryIds,
          tagIds: parsed.tagIds,
          status: parsed.intent === "publish" ? "PUBLISHED" : "DRAFT",
        },
      });

      setDebug({ ok: true, res });
      // redireciona pra evidenciar sucesso
      if (res?.id) {
        window.location.href = `/edit-post/${res.id}`;
        return;
      }
      alert("Post criado com sucesso (sem ID retornado).");
    } catch (e) {
      const err = e as ApiError;
      setDebug({
        ok: false,
        status: err.status,
        code: err.code,
        fields: err.fields,
        message: err.message,
      });

      if (err.code === "P2002" && err.fields?.length) {
        for (const name of err.fields) {
          if (name === "slug") {
            setError("slug", { message: "Este slug já está em uso." });
          } else {
            // @ts-ignore (fallback para outros campos únicos)
            setError(name, { message: "Já está em uso." });
          }
        }
        setFormError("Corrija os campos destacados.");
        return;
      }

      setFormError(
        `Erro (${err.status ?? "?"}): ${
          err.message || "Não foi possível salvar."
        }`
      );
    }
  };

  const submit = handleSubmit(onSubmit);

  return (
    <form
      // blindagem: mesmo se o JS falhar, evitamos GET nativo
      method="post"
      onSubmit={(e) => {
        e.preventDefault(); // impede POST na rota /new-post
        //console.log("[NewPostForm] submit intercepted");
        submit(e); // chama RHF
      }}
      className="grid gap-4"
      noValidate
    >
      {/* Badge de hidratação */}
      {/*<div className="text-xs text-slate-500">
        Client OK: {hydrated ? "✅" : "❌"}
      </div>
      */}

      {/* Feedback global */}
      {formError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </div>
      )}

      {/* Painel de debug (remova depois) */}
      {debug && (
        <pre className="rounded-md bg-slate-50 p-3 text-xs text-slate-700 overflow-auto">
          {JSON.stringify(debug, null, 2)}
        </pre>
      )}

      <div>
        <label className="block text-sm font-medium">Slug</label>
        <input
          {...register("slug")}
          className="input"
          placeholder="meu-post-exemplo"
        />
        {errors.slug && (
          <p className="text-red-600 text-sm">{errors.slug.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Título</label>
        <input {...register("title")} className="input" />
        {errors.title && (
          <p className="text-red-600 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Resumo</label>
        <textarea {...register("excerpt")} rows={3} className="input" />
        {errors.excerpt && (
          <p className="text-red-600 text-sm">{errors.excerpt.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Conteúdo</label>
        <textarea {...register("content")} rows={10} className="input" />
        {errors.content && (
          <p className="text-red-600 text-sm">{errors.content.message}</p>
        )}
      </div>

      <fieldset className="rounded-md border border-slate-200 p-3">
        <legend className="px-1 text-sm font-medium">Categorias</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
          {categories.map((c: any) => (
            <label key={c.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                value={c.id}
                {...register("categoryIds")}
                className="h-4 w-4"
              />
              <span>{c.name}</span>
            </label>
          ))}
        </div>
        {errors.categoryIds && (
          <p className="text-red-600 text-sm">
            {(errors.categoryIds.message as any) || ""}
          </p>
        )}
      </fieldset>

      <fieldset className="rounded-md border border-slate-200 p-3">
        <legend className="px-1 text-sm font-medium">Tags</legend>
        <div className="mt-2 flex flex-wrap gap-3">
          {tags.map((t: any) => (
            <label
              key={t.id}
              className="inline-flex items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                value={t.id}
                {...register("tagIds")}
                className="h-4 w-4"
              />
              <span>#{t.name}</span>
            </label>
          ))}
        </div>
        {errors.tagIds && (
          <p className="text-red-600 text-sm">
            {(errors.tagIds.message as any) || ""}
          </p>
        )}
      </fieldset>

      {/* intent hidden */}
      <input type="hidden" {...register("intent")} />

      <div className="mt-2 flex items-center gap-3">
        <button
          type="submit"
          onClick={() => setValue("intent", "save")}
          disabled={isSubmitting}
          className="bg-slate-900 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {isSubmitting ? "Salvando..." : "Salvar rascunho"}
        </button>

        <button
          type="submit"
          onClick={() => setValue("intent", "publish")}
          disabled={isSubmitting}
          className="border border-emerald-300 text-emerald-700 px-4 py-2 rounded hover:bg-emerald-50 disabled:opacity-60"
        >
          {isSubmitting ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </form>
  );
}
