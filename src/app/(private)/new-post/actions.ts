"use server";
import { ApiError, apiFetch } from "@/lib/api";
import { cookies } from "next/headers";

type State = {
  error?: string;
  fieldErrors?: { name: string; message: string }[];
  success?: boolean;
};

export async function createPostAction(
  _prev: State,
  fd: FormData
): Promise<State> {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) throw new Error("Precisa estar logado");

  const payload = {
    slug: String(fd.get("slug") || ""),
    title: String(fd.get("title") || ""),
    excerpt: String(fd.get("excerpt") || ""),
    content: String(fd.get("content") || ""),
    categoryIds: fd.getAll("categoryIds").map(String),
    tagIds: fd.getAll("tagIds").map(String),
    status: "DRAFT",
  };

  try {
    await apiFetch("/posts", {
      method: "POST",
      body: payload,
      accessToken: token,
    });
    return { success: true };
  } catch (e: any) {
    if (e instanceof ApiError && e.code === "P2002") {
      const fields = e.fields ?? [];
      // mensagem genérica + erros por campo conforme vierem
      return {
        error: "Valor único já existe.",
        fieldErrors: fields.map((name: string) => ({
          name,
          message: "Já está em uso.",
        })),
      };
    }
    // outros erros exibem mensagem do back sem if por campo
    return { error: e.message || "Falha ao salvar." };
  }
}
