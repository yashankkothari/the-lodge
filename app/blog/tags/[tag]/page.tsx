import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/landing/footer";
import { ArrowLeft, ArrowRightIcon } from "@/components/shared/site-icons";
import { siteConfig } from "@/config/site";
import {
  formatPostDate,
  getAllPosts,
  getAllTags,
  tagLabel,
} from "@/lib/blog";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tag.tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const label = tagLabel(tag);
  return {
    title: `${label} posts`,
    description: `Writing tagged ${label}.`,
    alternates: { canonical: `${siteConfig.meta.url}/blog/tags/${tag}` },
  };
}

export default async function BlogTagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const known = getAllTags().some((entry) => entry.tag === tag);
  if (!known) notFound();

  const posts = getAllPosts().filter((post) => post.tags.includes(tag));

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

        <div className="px-6 pt-4">
          <h1 className="section-heading text-balance">{tagLabel(tag)}</h1>
        </div>

        <p className="px-6 pt-4 font-mono text-[11px] tracking-wider text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>

        <ul className="mt-5 border-t border-dashed">
          {posts.map((post) => (
            <li key={post.slug} className="group border-b">
              <Link
                href={`/blog/${post.slug}`}
                className="block px-6 py-5 transition-colors hover:bg-muted/10"
              >
                <time
                  dateTime={post.date}
                  className="font-mono text-[11px] tracking-wider text-muted-foreground"
                >
                  {formatPostDate(post.date)}
                </time>
                <h2 className="mt-1.5 text-base font-medium tracking-tight group-hover:text-primary">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
                <ArrowRightIcon
                  aria-hidden="true"
                  className="mt-2 size-3.5 text-muted-foreground/30 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
