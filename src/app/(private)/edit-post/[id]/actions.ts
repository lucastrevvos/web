import { apiFetch } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function updatePostAction(id: string, formData: FormData) {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) throw new Error("Precisa estar logado");

  const categoryIds = formData.getAll("categoryIds").map(String);
  const tagIds = formData.getAll("tagIds").map(String);

  const payload = {
    slug: String(formData.get("slug") || ""),
    title: String(formData.get("title") || ""),
    excerpt: String(formData.get("excerpt") || ""),
    content: String(formData.get("content") || ""),
    categoryIds,
    tagIds,
  };

  console.log(payload);

  const updated = await apiFetch(`/posts/${id}`, {
    method: "PUT",
    body: payload,
    accessToken: token,
  });

  redirect(`/post/${updated.slug ?? payload.slug}`);
}

export async function deletePostAction(id: string) {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) throw new Error("Precisa estar logado");

  await apiFetch(`/posts/${id}`, {
    method: "DELETE",
    accessToken: token,
  });
  redirect("/");
}
