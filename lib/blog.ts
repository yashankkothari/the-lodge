import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  /** Tags excluding the collection marker `post`. */
  tags: string[];
  /** Body markdown, frontmatter stripped. */
  body: string;
  /** First paragraph, used for previews. */
  excerpt: string;
  readingMinutes: number;
}

const BLOG_DIR = path.join(process.cwd(), "content/blog");

/** Tag labels. Any tag not listed falls back to a title-cased slug. */
export const tagLabels: Record<string, string> = {
  "data-engineering": "Data engineering",
  genai: "GenAI",
  llms: "LLMs",
  "ai-philosophy": "AI philosophy",
  backend: "Backend",
  agents: "Agents",
  guides: "Guides",
  essays: "Essays",
  linux: "Linux",
  ollama: "Ollama",
  omarchy: "Omarchy",
  snowflake: "Snowflake",
  airflow: "Airflow",
  dbt: "dbt",
  sql: "SQL",
  python: "Python",
  rag: "RAG",
  reviews: "Reviews",
  "android-tv": "Android TV",
  tcl: "TCL",
  adb: "ADB",
};

export function tagLabel(tag: string): string {
  return (
    tagLabels[tag] ??
    tag.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())
  );
}

function excerptFrom(body: string): string {
  const withoutHtml = body.replace(/<figure[\s\S]*?<\/figure>/g, "");
  const paragraph = withoutHtml
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith("#") && !block.startsWith("```"));
  if (!paragraph) return "";
  return paragraph
    .replace(/[*_`>#]/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

let cache: BlogPost[] | null = null;

/** Every published post, newest first. Read once per process. */
export function getAllPosts(): BlogPost[] {
  if (cache) return cache;

  const files = readdirSync(BLOG_DIR).filter((file) => file.endsWith(".md"));

  cache = files
    .map((file) => {
      const raw = readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const tags = Array.isArray(data.tags)
        ? (data.tags as string[]).filter((tag) => tag !== "post")
        : [];

      return {
        slug: file.replace(/\.md$/, ""),
        title: String(data.title ?? file),
        date:
          data.date instanceof Date
            ? data.date.toISOString().slice(0, 10)
            : String(data.date ?? ""),
        tags,
        body: content,
        excerpt: excerptFrom(content),
        readingMinutes: readingMinutes(content),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return cache;
}

export function getPost(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

/** Distinct tags across all posts, most used first. */
export function getAllTags(): { tag: string; label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts]
    .map(([tag, count]) => ({ tag, label: tagLabel(tag), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function formatPostDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
