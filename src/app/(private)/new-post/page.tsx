// apps/web/src/app/(private)/new-post/page.tsx
export const dynamic = "force-dynamic";

import { apiFetch } from "@/lib/api";
import NewPostForm from "./NewPostForm";
import { cookies } from "next/headers";

export default async function NewPostPage() {
  const [categories, tags] = await Promise.all([
    apiFetch("/categories"),
    apiFetch("/tags"),
  ]);
  const token = (await cookies()).get("accessToken")?.value;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Novo Post</h1>
      {/* NÃO coloque <form> aqui. Apenas o componente cliente abaixo. */}
      <NewPostForm categories={categories} tags={tags} accessToken={token} />
    </main>
  );
}
