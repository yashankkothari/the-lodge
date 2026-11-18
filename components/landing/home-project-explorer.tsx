"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProjectExplorerProps } from "@/components/project-explorer";
import { homeProjectsConfig, projectsSectionConfig } from "@/config/projects";
import { trackEvent } from "@/lib/analytics";
import styles from "./home-project-explorer.module.css";

export function HomeProjectExplorer({ projects = [], title }: ProjectExplorerProps) {
  const featured = projects.filter((project) => project.enabled !== false && homeProjectsConfig.ids.includes(project.id));
  return (
    <section className="border-t border-dashed pt-6" aria-labelledby="home-projects-title">
      <h2 id="home-projects-title" className="section-heading">{title}</h2>
      <div className="px-6 pb-5 pt-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{projectsSectionConfig.description}</p>
        <div className="mt-5 grid gap-7 sm:grid-cols-2 sm:gap-5">
          {featured.map((project) => {
            const name = project.title.split(" — ")[0];
            const preview = homeProjectsConfig.previews[project.id];
            const href = project.liveUrl ?? `/project/${project.id}`;
            return (
              <article key={project.id} className={styles.card}>
                <a href={href} target={project.liveUrl ? "_blank" : undefined} rel={project.liveUrl ? "noopener noreferrer" : undefined} className={styles.link} onClick={() => trackEvent("project_clicked", { project_id: project.id, project_title: project.title, target_type: project.liveUrl ? "external_url" : "case_study", url: href })}>
                  <div className={styles.preview}>
                    <Image src={preview.src} alt={preview.alt} fill sizes="(max-width: 639px) 90vw, 360px" className={styles.image} />
                    <span aria-hidden="true" className={styles.visit}><ArrowUpRight className="size-4" /></span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <h3 className="text-base font-medium tracking-tight">{name}</h3>
                    <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                      <span className={`size-1.5 rounded-full ${project.status === "shipped" ? "bg-success" : "bg-primary"}`} />
                      {project.status && projectsSectionConfig.statusLabels[project.status]}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
                  <span className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary">
                    {projectsSectionConfig.featuredActions[project.id]}<ArrowUpRight aria-hidden="true" className="size-4" />
                  </span>
                </a>
                <Link href={`/project/${project.id}`} className="micro-transition inline-flex min-h-11 items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  {projectsSectionConfig.caseStudyLabel}<ArrowUpRight aria-hidden="true" className="size-3" />
                </Link>
              </article>
            );
          })}
        </div>
        <Link href="/portfolio" className="micro-transition mt-5 inline-flex min-h-11 items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          {projectsSectionConfig.allProjectsLabel}<ArrowUpRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
