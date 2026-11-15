import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Footer } from "@/components/landing/footer";
import { ArrowLeft, ArrowRight } from "@/components/shared/site-icons";
import { siteConfig } from "@/config/site";
import {
  formatPostDate,
  getAllPosts,
  getPost,
  tagLabel,
} from "@/lib/blog";
import { markdownComponents } from "@/lib/markdown/markdown-components";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return { title: "Post not found" };

  const url = `${siteConfig.meta.url}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags.map(tagLabel),
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      creator: siteConfig.meta.twitterCreator,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const posts = getAllPosts();
  const index = posts.findIndex((entry) => entry.slug === post.slug);
  const newer = index > 0 ? posts[index - 1] : undefined;
  const older = index < posts.length - 1 ? posts[index + 1] : undefined;

  return (
    <>
      <main
        id="main-content"
        className="relative flex min-h-dvh flex-col overflow-x-clip border-x bg-background pb-12 pt-14"
      >
        <div className="border-t border-dashed px-6 pt-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-3" />
            All writing
          </Link>
        </div>

        <header className="px-6 pt-4">
          <h1 className="section-heading text-balance text-xl font-medium tracking-tight">
            {post.title}
          </h1>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 font-mono text-[11px] tracking-wider text-muted-foreground">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span className="text-muted-foreground/40">{post.readingMinutes} min read</span>
          </p>
          {post.tags.length > 0 && (
            <p className="flex flex-wrap gap-1.5 pt-3">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tags/${tag}`}
                  className="micro-transition rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground hover:text-foreground"
                >
                  {tagLabel(tag)}
                </Link>
              ))}
            </p>
          )}
        </header>

        <article className="prose prose-neutral dark:prose-invert mt-6 max-w-none border-t border-dashed px-6 py-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={markdownComponents}
          >
            {post.body}
          </ReactMarkdown>
        </article>

        <nav
          aria-label="More posts"
          className="flex items-start justify-between gap-4 border-t border-dashed px-6 py-6"
        >
          <div className="min-w-0 flex-1">
            {older ? (
              <Link
                href={`/blog/${older.slug}`}
                className="group flex min-w-0 flex-col gap-1"
              >
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                  <ArrowLeft aria-hidden="true" className="size-3" />
                  Older
                </span>
                <span className="truncate text-sm font-medium group-hover:text-primary">
                  {older.title}
                </span>
              </Link>
            ) : (
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft aria-hidden="true" className="size-3" />
                All writing
              </Link>
            )}
          </div>
          <div className="min-w-0 flex-1 text-right">
            {newer ? (
              <Link
                href={`/blog/${newer.slug}`}
                className="group inline-flex min-w-0 flex-col items-end gap-1"
              >
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                  Newer
                  <ArrowRight aria-hidden="true" className="size-3" />
                </span>
                <span className="truncate text-sm font-medium group-hover:text-primary">
                  {newer.title}
                </span>
              </Link>
            ) : (
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground"
              >
                All writing
                <ArrowRight aria-hidden="true" className="size-3" />
              </Link>
            )}
          </div>
        </nav>
      </main>
      <Footer />
    </>
  );
}
