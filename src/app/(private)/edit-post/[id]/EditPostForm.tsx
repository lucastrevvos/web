"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PostEditSchema, type PostEditInput } from "./schema";
import { apiFetch, ApiError } from "@/lib/api";
import { MarkdownView } from "@/components/MarkdownView"; // << preview seguro

export default function EditPostForm({
  postId,
  initialValues,
  categories,
  tags,
  accessToken,
}: {
  postId: string;
  initialValues: {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    categoryIds: string[];
    tagIds: string[];
    status: "DRAFT" | "PUBLISHED";
    coverImage?: string;
  };
  categories: any[];
  tags: any[];
  accessToken?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    watch,
    reset,
  } = useForm<PostEditInput>({
    resolver: zodResolver(PostEditSchema),
    defaultValues: {
      ...initialValues,
      coverImage: initialValues.coverImage ?? "",
      intent: "save",
    },
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  // Mantém o toggle “Publicar/Despublicar” coerente com status atual
  const status = watch("status");
  const contentValue = watch("content") || "";
  const coverUrl = watch("coverImage") || "";

  // refs para inputs de arquivo
  const coverInputRef = useRef<HTMLInputElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);

  // estados de upload
  const [uplodingCover, setUploadingCover] = useState(false);
  const [uplodingInline, setUplodingInline] = useState(false);

  useEffect(() => {
    // garante que RHF está com os valores do server (se recarregar)
    reset({
      ...initialValues,
      coverImage: initialValues.coverImage ?? "",
      intent: "save",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  //helper de upload para a API
  async function uploadToApi(file: File): Promise<string> {
    const API = process.env.NEXT_PUBLIC_API_URL!;
    const APP = process.env.NEXT_PUBLIC_APP_SLUG || "portal";

    const body = new FormData();
    body.append("file", file);

    const res = await fetch(`${API}/uploads`, {
      method: "POST",
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        "x-app-slug": APP,
      } as any,
      body,
    } as any);

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      throw new Error(msg || `Falha no upload (${res.status})`);
    }

    const data = (await res.json()) as { url: string };
    if (!data?.url) throw new Error("Resposta inválida do servidor de upload.");

    return data.url;
  }

  // handlers dos dois uploads
  async function handleUploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingCover(true);
      const url = await uploadToApi(file);
      setValue("coverImage", url, { shouldDirty: true });
    } catch (err: any) {
      alert(err?.message || "Falha ao enviar capa");
    } finally {
      setUploadingCover(false);
      e.currentTarget.value = "";
    }
  }

  async function handleUploadInline(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUplodingInline(true);
      const url = await uploadToApi(file);
      const alt = file.name.replace(/\.[^.]+$/, "") || "imagem";
      const insertion = `\n\n![${alt}](${url})\n\n`;

      setValue("content", contentValue + insertion, { shouldDirty: true });
      setTab("preview");
    } catch (err: any) {
      alert(err?.message || "Falha ao enviar imagem");
    } finally {
      setUplodingInline(false);
      e.currentTarget.value = "";
    }
  }

  const onSubmit = async (values: PostEditInput) => {
    setFormError(null);
    setSuccess(null);

    const parsed = PostEditSchema.parse(values);

    // Deriva o status do botão clicado
    let nextStatus: "DRAFT" | "PUBLISHED" = parsed.status;
    if (parsed.intent === "publish") nextStatus = "PUBLISHED";
    if (parsed.intent === "unpublish") nextStatus = "DRAFT";

    try {
      await apiFetch(`/posts/${postId}`, {
        method: "PUT",
        accessToken,
        body: {
          slug: parsed.slug,
          title: parsed.title,
          excerpt: parsed.excerpt,
          content: parsed.content,
          categoryIds: parsed.categoryIds,
          tagIds: parsed.tagIds,
          status: nextStatus,
          coverImage: parsed.coverImage || null,
        },
      });

      setSuccess("Post atualizado com sucesso!");
      setValue("status", nextStatus, { shouldDirty: false }); // reflete na UI
    } catch (e) {
      const err = e as ApiError;

      // Unique (ex.: slug)
      if (err.code === "P2002" && err.fields?.length) {
        for (const name of err.fields) {
          if (name === "slug") {
            setError("slug", { message: "Este slug já está em uso." });
          } else {
            // fallback para outros únicos no futuro
            // @ts-ignore
            setError(name, { message: "Já está em uso." });
          }
        }
        setFormError("Corrija os campos destacados.");
        return;
      }

      setFormError(err.message || "Não foi possível atualizar.");
    }
  };

  const submit = handleSubmit(onSubmit);

  async function onDelete() {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;
    try {
      await apiFetch(`/posts/${postId}`, {
        method: "DELETE",
        accessToken,
      });
      window.location.href = "/";
    } catch (e) {
      const err = e as ApiError;
      setFormError(err.message || "Falha ao excluir.");
    }
  }

  return (
    <form
      method="post"
      onSubmit={(e) => {
        e.preventDefault();
        submit(e);
      }}
      className="grid gap-4"
      noValidate
    >
      {success && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {success}
        </div>
      )}
      {formError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Slug</label>
        <input
          {...register("slug")}
          required
          minLength={3}
          maxLength={120}
          pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
          title="Use apenas minúsculas, números e hífens (kebab-case)"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        {errors.slug && (
          <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Título</label>
        <input
          {...register("title")}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Resumo</label>
        <textarea
          {...register("excerpt")}
          rows={3}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        {errors.excerpt && (
          <p className="mt-1 text-xs text-red-600">{errors.excerpt.message}</p>
        )}
      </div>

      {/* Capa (com upload) */}
      <div>
        <label className="mb-1 block text-sm font-medium">Capa</label>

        <div className="flex flex-wrap items-center gap-2">
          <input
            {...register("coverImage")}
            placeholder="URL da capa (opcional)"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 md:w-auto md:flex-1"
          />

          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadCover}
          />
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={uplodingCover}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-60"
            title="Enviar arquivo de imagem e preencher a URL automaticamente"
          >
            {uplodingCover ? "Enviando..." : "Upload capa"}
          </button>

          {!!coverUrl && (
            <button
              type="button"
              onClick={() => setValue("coverImage", "", { shouldDirty: true })}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
            >
              Remover capa
            </button>
          )}
        </div>

        {!!coverUrl && (
          <div className="mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt="Capa"
              className="h-24 w-auto rounded-md border border-slate-200"
            />
          </div>
        )}

        {errors.coverImage && (
          <p className="mt-1 text-xs text-red-600">
            {errors.coverImage.message as any}
          </p>
        )}
      </div>

      {/* Editor / Preview + Upload inline */}

      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => setTab("edit")}
          className={
            tab === "edit" ? "font-semibold underline" : "text-slate-500"
          }
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={
            tab === "preview" ? "font-semibold underline" : "text-slate-500"
          }
        >
          Preview
        </button>

        <span className="mx-2 hidden text-slate-300 md:inline">|</span>

        <input
          type="file"
          ref={contentImageInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleUploadInline}
        />
        <button
          type="button"
          onClick={() => contentImageInputRef.current?.click()}
          disabled={uplodingInline}
          className="text-slate-600 hover:underline disabled:opacity-60"
          title="Faz upload e insere ![alt](url) no conteúdo"
        >
          {uplodingInline ? "Enviando imagem..." : "Inserir imagem no conteúdo"}
        </button>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Conteúdo</label>

        {tab === "edit" ? (
          <textarea
            {...register("content")}
            rows={10}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder="Markdown (aceita HTML básico, sanitizado)"
          />
        ) : (
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <MarkdownView markdown={contentValue} />
          </div>
        )}

        {errors.content && (
          <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>
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
          <p className="mt-1 text-xs text-red-600">
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
          <p className="mt-1 text-xs text-red-600">
            {(errors.tagIds.message as any) || ""}
          </p>
        )}
      </fieldset>

      {/* status atual + ações */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600">
          Status atual: <strong>{status}</strong>
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          onClick={() => setValue("intent", "save")}
          disabled={isSubmitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {isSubmitting ? "Salvando..." : "Salvar alterações"}
        </button>

        {status === "DRAFT" ? (
          <button
            type="submit"
            onClick={() => setValue("intent", "publish")}
            disabled={isSubmitting}
            className="rounded-md border border-emerald-300 px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
          >
            {isSubmitting ? "Publicando..." : "Publicar"}
          </button>
        ) : (
          <button
            type="submit"
            onClick={() => setValue("intent", "unpublish")}
            disabled={isSubmitting}
            className="rounded-md border border-amber-300 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 disabled:opacity-60"
          >
            {isSubmitting ? "Alterando..." : "Despublicar"}
          </button>
        )}

        <button
          type="button"
          onClick={onDelete}
          className="rounded-md border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Excluir
        </button>
      </div>
    </form>
  );
}
