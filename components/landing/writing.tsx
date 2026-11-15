import Link from "next/link";
import { ArrowRightIcon } from "@/components/shared/site-icons";
import { formatPostDate, getAllPosts } from "@/lib/blog";

const FEATURED_COUNT = 4;

export function Writing() {
  const posts = getAllPosts().slice(0, FEATURED_COUNT);
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-dashed pt-6">
      <h2 className="no-js-visible section-heading mb-3">Selected writing</h2>

      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex min-h-11 items-center gap-3 px-6 py-2.5 transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none"
            >
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground group-hover:text-primary">
                {post.title}
              </span>
              <time
                dateTime={post.date}
                className="shrink-0 font-mono text-[10px] tracking-wider text-muted-foreground"
              >
                {formatPostDate(post.date)}
              </time>
              <ArrowRightIcon
                aria-hidden="true"
                className="size-3.5 shrink-0 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-center border-y py-4">
        <Link
          href="/blog"
          className="flex items-center gap-2 font-sans text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          All writing
          <ArrowRightIcon aria-hidden="true" className="size-3.5 -rotate-45" />
        </Link>
      </div>
    </section>
  );
}
