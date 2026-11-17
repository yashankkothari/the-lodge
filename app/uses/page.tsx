import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/landing/footer";
import { UsesGallery } from "@/components/uses-gallery";
import { siteConfig } from "@/config/site";
import { usesConfig, usesLinks } from "@/config/uses";
import { formatPostDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: usesConfig.metaTitle,
  description: usesConfig.description,
  alternates: { canonical: `${siteConfig.meta.url}/uses` },
};

export default function UsesPage() {
  return (
    <>
      <main id="main-content" className="relative min-h-dvh overflow-x-clip border-x bg-background pb-8 pt-14">
        <header className="pb-9 pt-9 sm:pt-12">
          <p className="px-6 pb-3 font-mono text-xs text-primary sm:px-8">{usesConfig.title}</p>
          <h1 className="section-heading text-balance">{usesConfig.headline}</h1>
          <p className="max-w-xl px-6 pt-5 text-sm leading-relaxed text-muted-foreground sm:px-8">{usesConfig.intro}</p>
          <p className="px-6 pt-3 font-mono text-[10px] text-muted-foreground/70 sm:px-8">
            Last updated <time dateTime={usesConfig.updated}>{formatPostDate(usesConfig.updated)}</time>
          </p>
        </header>
        <UsesGallery />
        <section aria-labelledby="uses-related" className="border-t border-dashed px-6 py-7 sm:px-8">
          <h2 id="uses-related" className="text-sm font-medium tracking-tight">{usesConfig.relatedTitle}</h2>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-xs">
            {usesLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="micro-transition text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground">{link.label}</Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 font-mono text-[10px] leading-relaxed text-muted-foreground/70">{usesConfig.galleryNote}</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
