import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/landing/footer";
import { ProjectExplorer } from "@/components/project-explorer";
import { ArrowRightIcon } from "@/components/shared/site-icons";
import { projectsConfig } from "@/config/projects";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Data systems, browser extensions, applied ML projects, and a pixel-art game.",
  alternates: { canonical: `${siteConfig.meta.url}/portfolio` },
};

const groups = [
  {
    label: "Current focus",
    ids: ["savory", "pixopoly"],
  },
  {
    label: "Tools and experiments",
    ids: ["notesaid", "malnotware", "oncolytix", "truehire", "aadhaar-redesign"],
  },
];

const enabled = projectsConfig.filter((p) => p.enabled !== false);

export default function PortfolioPage() {
  return (
    <>
      <main
        id="main-content"
        className="relative flex min-h-dvh flex-col overflow-x-clip border-x bg-background pb-12 pt-14"
      >
        <div className="border-t border-dashed px-6 pt-4">
          <h1 className="section-heading text-balance">Projects</h1>
        </div>

        <p className="px-6 pt-4 text-sm leading-relaxed text-muted-foreground">
          Things I&apos;ve made, and a few I&apos;m still figuring out.
        </p>

        <div className="px-6 pt-5">
          <a
            href={`https://github.com/${siteConfig.personal.githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="micro-transition inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"
          >
            All repositories
            <ArrowRightIcon aria-hidden="true" className="size-3.5 -rotate-45" />
          </a>
        </div>

        <div className="mt-6 border-t border-dashed">
          <ProjectExplorer
            projects={enabled.map((p) => ({
              id: p.id,
              title: p.title,
              year: p.year,
              description: p.description,
              category: p.category,
              status: p.status,
              liveUrl: p.liveUrl,
              githubUrl: p.githubUrl,
              image: p.image,
              imageAlt: p.imageAlt,
              enabled: p.enabled,
              order: p.order,
            }))}
            title="All projects"
          />
        </div>

        {groups.map((group) => {
          const items = group.ids
            .map((id) => enabled.find((p) => p.id === id))
            .filter((p): p is (typeof enabled)[number] => Boolean(p));

          if (items.length === 0) return null;

          return (
            <section
              key={group.label}
              aria-label={group.label}
              className="border-t border-dashed px-6 py-6"
            >
              <h2 className="font-mono text-xs tracking-wider text-muted-foreground">
                {group.label}
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {items.map((project) => (
                  <article
                    key={project.id}
                    className="group relative overflow-hidden rounded-xl bg-card ring-1 ring-inset ring-border"
                  >
                    <Link href={`/project/${project.id}`} className="block">
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        <Image
                          src={project.image}
                          alt={project.imageAlt}
                          fill
                          sizes="(min-width: 640px) 45vw, 90vw"
                          className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-medium tracking-tight text-foreground">
                          {project.title}
                        </h3>
                        <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                          {project.description}
                        </p>
                        <p className="mt-2 font-mono text-[10px] tracking-wider text-muted-foreground/70">
                          {project.tags.slice(0, 3).join(" · ")}
                        </p>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </>
  );
}
