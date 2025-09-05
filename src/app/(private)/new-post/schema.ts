import { z } from "zod";

export const PostFormSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug muito curto")
    .max(120, "Slug muito longo")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use apenas minúsculas, números e hífens"
    ),
  title: z.string().min(3, "Título muito curto").max(140, "Título muito longo"),
  excerpt: z.string().optional(),
  content: z.string().min(20, "Conteúdo muito curto"),
  categoryIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
  intent: z.enum(["save", "publish"]).default("save"),
});

export type PostFormValues = z.infer<typeof PostFormSchema>;
