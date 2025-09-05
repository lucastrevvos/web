import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

// Permitir <iframe> só de YouTube/Vimeo e ajustar <img>
const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), "iframe"],
  attributes: {
    ...defaultSchema.attributes,
    iframe: [
      [
        "src",
        /^https:\/\/(www\.)?(youtube\.com|youtu\.be|player\.vimeo\.com)\/.*/,
      ],
      "allow",
      "allowfullscreen",
      "width",
      "height",
      "frameborder",
    ],
    img: [...(defaultSchema.attributes?.img || []), "loading", "decoding"],
  },
};

export function MarkdownView({ markdown }: { markdown: string }) {
  return (
    <article className="prose prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeRaw], [rehypeSanitize, schema]]}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
