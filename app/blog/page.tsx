import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/landing/footer";
import { ArrowRightIcon } from "@/components/shared/site-icons";
import { siteConfig } from "@/config/site";
import { formatPostDate, getAllPosts, getAllTags, tagLabel } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on data pipelines, backend systems, applied ML, and building things.",
  alternates: { canonical: `${siteConfig.meta.url}/blog` },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <>
      <main
        id="main-content"
        className="relative flex min-h-dvh flex-col overflow-x-clip border-x bg-background pb-12 pt-14"
      >
        <div className="border-t border-dashed px-6 pt-4">
          <h1 className="section-heading text-balance">Writing</h1>
        </div>

        <p className="px-6 pt-4 text-sm leading-relaxed text-muted-foreground">
          Notes on data pipelines, backend systems, applied ML, and the things I
          build. Usually with code, diagrams, and a reason for one approach over
          another.
        </p>

        <nav aria-label="Topics" className="flex flex-wrap gap-1.5 px-6 pt-5">
          {tags.map((tag) => (
            <Link
              key={tag.tag}
              href={`/blog/tags/${tag.tag}`}
              className="micro-transition inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] text-muted-foreground ring-1 ring-inset ring-border hover:text-foreground"
            >
              {tag.label}
              <span className="text-muted-foreground/60">{tag.count}</span>
            </Link>
          ))}
        </nav>

        <ul className="mt-6 border-t border-dashed">
          {posts.map((post) => (
            <li key={post.slug} className="group border-b">
              <Link
                href={`/blog/${post.slug}`}
                className="block px-6 py-5 transition-colors hover:bg-muted/10"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <time
                    dateTime={post.date}
                    className="font-mono text-[11px] tracking-wider text-muted-foreground"
                  >
                    {formatPostDate(post.date)}
                  </time>
                  <span className="font-mono text-[10px] text-muted-foreground/50">
                    {post.readingMinutes} min
                  </span>
                </div>
                <h2 className="mt-1.5 text-base font-medium tracking-tight text-foreground group-hover:text-primary">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
                <p className="mt-2 flex flex-wrap items-center gap-1.5">
                  {post.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                    >
                      {tagLabel(tag)}
                    </span>
                  ))}
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="ml-auto size-3.5 text-muted-foreground/30 transition-transform group-hover:translate-x-0.5"
                  />
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
