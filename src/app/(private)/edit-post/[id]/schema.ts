// apps/web/src/app/(private)/edit-post/[id]/schema.ts
import { z } from "zod";

export const PostEditSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug muito curto")
    .max(120, "Slug muito longo")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use minúsculas, números e hífens"),
  title: z.string().min(3, "Título muito curto").max(140, "Título muito longo"),
  excerpt: z.string().optional(),
  content: z.string().min(20, "Conteúdo muito curto"),
  categoryIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
  // status atual do post
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  // ação do botão
  intent: z.enum(["save", "publish", "unpublish"]).default("save"),
});

export type PostEditInput = z.input<typeof PostEditSchema>;
