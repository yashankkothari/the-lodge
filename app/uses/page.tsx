import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/landing/footer";
import { getUsesArt } from "@/components/landing/uses-art";
import { siteConfig } from "@/config/site";
import { usesConfig, usesGroups, usesLinks } from "@/config/uses";
import { formatPostDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: usesConfig.metaTitle,
  description: usesConfig.description,
  alternates: { canonical: `${siteConfig.meta.url}/uses` },
};

export default function UsesPage() {
  return (
    <>
      <main
        id="main-content"
        className="relative flex min-h-dvh flex-col overflow-x-clip border-x bg-background pb-12 pt-14"
      >
        <div className="border-t border-dashed px-6 pt-4">
          <h1 className="section-heading text-balance">Uses</h1>
        </div>

        <p className="px-6 pt-4 text-sm leading-relaxed text-muted-foreground">
          {usesConfig.intro}
        </p>
        <p className="px-6 pt-2 font-mono text-[11px] tracking-wider text-muted-foreground">
          Last updated {formatPostDate(usesConfig.updated)}
        </p>

        {usesGroups.map((group) => (
          <section
            key={group.id}
            id={group.id}
            aria-label={group.title}
            className="scroll-mt-20 border-t border-dashed px-6 py-6"
          >
            <h2 className="text-base font-medium tracking-tight">
              {group.title}
            </h2>

            {group.body && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {group.body}
              </p>
            )}

            {group.items.length > 0 && (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {group.items.map((item) => {
                  const Art = getUsesArt(item.art);

                  return (
                    <li
                      key={item.id}
                      className="group relative overflow-hidden rounded-xl bg-card p-3 ring-1 ring-inset ring-border"
                    >
                      <div className="flex h-24 items-center justify-center text-muted-foreground">
                        {Art ? (
                          <Art size={76} className="h-24 w-auto" />
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs font-medium leading-snug text-foreground">
                        {item.name}
                      </p>
                      {item.note && (
                        <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                          {item.note}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            {group.plain && group.plain.length > 0 && (
              <dl className="mt-3 space-y-1.5 text-sm">
                {group.plain.map((entry) => (
                  <div
                    key={`${group.id}-${entry.label}`}
                    className="flex flex-col gap-0.5 sm:flex-row sm:gap-3"
                  >
                    <dt className="w-40 shrink-0 font-medium text-foreground">
                      {entry.label}
                    </dt>
                    <dd className="text-muted-foreground">{entry.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        ))}

        <section
          aria-label="Related reading"
          className="border-t border-dashed px-6 py-6"
        >
          <h2 className="text-base font-medium tracking-tight">Related</h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
            {usesLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="border-t border-dashed px-6 py-6 font-mono text-[11px] text-muted-foreground">
          These are paper-cut drawings of the gear, not product photos. This is
          a{" "}
          <a
            href="https://uses.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-border underline-offset-4 hover:text-foreground"
          >
            /uses page
          </a>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
