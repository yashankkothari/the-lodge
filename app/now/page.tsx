import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/landing/footer";
import { siteConfig } from "@/config/site";
import {
  nowConfig,
  nowListening,
  nowPlaying,
  nowReading,
  nowSections,
} from "@/config/now";
import { formatPostDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: nowConfig.metaTitle,
  description: nowConfig.description,
  alternates: { canonical: `${siteConfig.meta.url}/now` },
};

type ShelfItem = { id: string; title: string; creator: string; image: string };

function Shelf({ items }: { items: readonly ShelfItem[] }) {
  return (
    <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((item) => (
        <li key={item.id}>
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted ring-1 ring-inset ring-border">
            <Image
              src={item.image}
              alt={`${item.title} cover`}
              fill
              sizes="(min-width: 640px) 22vw, 45vw"
              className="object-cover"
            />
          </div>
          <p className="mt-2 text-xs font-medium leading-snug text-foreground">
            {item.title}
          </p>
          <p className="text-[11px] leading-snug text-muted-foreground">
            {item.creator}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function NowPage() {
  return (
    <>
      <main
        id="main-content"
        className="relative flex min-h-dvh flex-col overflow-x-clip border-x bg-background pb-12 pt-14"
      >
        <div className="border-t border-dashed px-6 pt-4">
          <h1 className="section-heading text-balance">Now</h1>
        </div>

        <p className="px-6 pt-4 text-sm leading-relaxed text-muted-foreground">
          {nowConfig.intro}
        </p>
        <p className="px-6 pt-2 font-mono text-[11px] tracking-wider text-muted-foreground">
          Last updated {formatPostDate(nowConfig.updated)} · {nowConfig.city}
        </p>

        {nowSections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-label={section.title}
            className="scroll-mt-20 border-t border-dashed px-6 py-6"
          >
            <h2 className="text-base font-medium tracking-tight">
              {section.title}
            </h2>

            {section.body && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            )}

            {section.items && section.items.length > 0 && (
              <ul className="mt-3 space-y-2">
                {section.items.map((item) => (
                  <li
                    key={item.label ?? item.text}
                    className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span aria-hidden="true" className="text-muted-foreground/40">
                      ·
                    </span>
                    <span>
                      {item.label && (
                        <>
                          {item.href ? (
                            <Link
                              href={item.href}
                              {...(item.href.startsWith("http")
                                ? { target: "_blank", rel: "noopener noreferrer" }
                                : {})}
                              className="font-medium text-foreground underline decoration-border underline-offset-4 hover:text-primary"
                            >
                              {item.label}
                            </Link>
                          ) : (
                            <span className="font-medium text-foreground">
                              {item.label}
                            </span>
                          )}
                          {" — "}
                        </>
                      )}
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section
          id="reading"
          aria-label="Reading"
          className="scroll-mt-20 border-t border-dashed px-6 py-6"
        >
          <h2 className="text-base font-medium tracking-tight">Reading</h2>
          <Shelf items={nowReading} />
        </section>

        <section
          aria-label="Listening"
          className="border-t border-dashed px-6 py-6"
        >
          <h2 className="text-base font-medium tracking-tight">Listening</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {nowListening.blurb}
          </p>
          <Shelf items={nowListening.items} />
        </section>

        <section
          aria-label="Playing"
          className="border-t border-dashed px-6 py-6"
        >
          <h2 className="text-base font-medium tracking-tight">Playing</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {nowPlaying.blurb}
          </p>
          <Shelf items={nowPlaying.items} />
        </section>

        <p className="border-t border-dashed px-6 py-6 font-mono text-[11px] text-muted-foreground">
          The hardware and software behind all this is on the{" "}
          <Link
            href="/uses"
            className="underline decoration-border underline-offset-4 hover:text-foreground"
          >
            uses page
          </Link>
          . This is a{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-border underline-offset-4 hover:text-foreground"
          >
            /now page
          </a>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
