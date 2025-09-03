"use server";
import { apiFetch } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createPostAction(fd: FormData) {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) throw new Error("Precisa estar logado");

  const categoryIds = fd.getAll("categoryIds").map(String);
  const tagIds = fd.getAll("tagIds").map(String);

  const payload = {
    slug: String(fd.get("slug") || ""),
    title: String(fd.get("title") || ""),
    excerpt: String(fd.get("excerpt") || ""),
    content: String(fd.get("content") || ""),
    status: "DRAFT",
    categoryIds,
    tagIds,
  };

  console.log(payload);

  const created = await apiFetch("/posts", {
    method: "POST",
    body: payload,
    accessToken: token,
  });

  redirect(`/post/${created.slug ?? payload.slug}`);
}
