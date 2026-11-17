import type { Metadata } from "next";
import Image from "next/image";
import { Footer } from "@/components/landing/footer";
import { siteConfig } from "@/config/site";
import {
  resumeEducation,
  resumeLeadership,
  resumeRoles,
  resumeSectionConfig,
  resumeCertifications,
  resumeSkillGroups,
} from "@/config/resume";
import { ArrowRightIcon, ForwardIcon } from "@/components/shared/site-icons";
import { PrintButton } from "./print-button";
import { ExperienceText } from "@/components/shared/experience-text";

export const metadata: Metadata = {
  title: "Experience & Resume",
  description:
    "Data engineering experience at ICICI Lombard, Colgate Palmolive, and Card91, plus education and skills.",
  alternates: { canonical: `${siteConfig.meta.url}/resume` },
};

function Company({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={logo}
        alt=""
        width={20}
        height={20}
        className="size-5 rounded-sm object-contain"
      />
      <span className="text-sm font-medium text-foreground">{name}</span>
    </div>
  );
}

export default function ResumePage() {
  return (
    <>
      <main
        id="main-content"
        className="relative flex min-h-dvh flex-col overflow-x-clip border-x bg-background pb-12 pt-14"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dashed px-6 pt-4">
          <h1 className="section-heading text-balance">Experience</h1>
        </div>

        <p className="px-6 pt-4 text-sm leading-relaxed text-muted-foreground">
          {resumeSectionConfig.intro}
        </p>

        <div className="flex flex-wrap items-center gap-2 px-6 py-5">
          <a
            href={resumeSectionConfig.resumePdf}
            className="micro-transition inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            Download resume
            <ForwardIcon aria-hidden="true" className="size-3.5" />
          </a>
          <PrintButton label={resumeSectionConfig.printLabel} />
          <a
            href={resumeSectionConfig.linkedinHref}
            target="_blank"
            rel="noopener noreferrer"
            className="micro-transition inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border hover:text-foreground"
          >
            LinkedIn
            <ArrowRightIcon aria-hidden="true" className="size-3.5" />
          </a>
        </div>

        <section aria-label="Roles" className="border-t border-dashed">
          {resumeRoles.map((role) => (
            <article key={role.id} className="micro-transition border-b px-6 py-6 last:border-b-0 hover:bg-muted/20 focus-within:bg-muted/20 motion-safe:hover:translate-x-0.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <Company name={role.company} logo={role.logo} />
                <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
                  {role.period} · {role.location}
                </p>
              </div>
              <h2 className="mt-2 text-base font-medium tracking-tight">
                {role.role}
              </h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-muted-foreground/40">
                {role.points.map((point) => (
                  <li key={point}><ExperienceText>{point}</ExperienceText></li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section aria-label="Leadership" className="border-t border-dashed px-6 py-6">
          <p className="font-mono text-xs tracking-wider text-muted-foreground">
            Leadership
          </p>
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4">
            <span className="text-sm font-medium text-foreground">
              {resumeLeadership.role}, {resumeLeadership.company}
            </span>
            <p className="font-mono text-[11px] text-muted-foreground">
              {resumeLeadership.period}
            </p>
          </div>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-muted-foreground/40">
            {resumeLeadership.points.map((point) => (
              <li key={point}><ExperienceText>{point}</ExperienceText></li>
            ))}
          </ul>
        </section>

        <section aria-label="Education" className="border-t border-dashed px-6 py-6">
          <p className="font-mono text-xs tracking-wider text-muted-foreground">
            Education
          </p>
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4">
            <span className="text-sm font-medium text-foreground">
              {resumeEducation.school}
            </span>
            <p className="font-mono text-[11px] text-muted-foreground">
              {resumeEducation.period}
            </p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {resumeEducation.degree}, {resumeEducation.honours}
          </p>
        </section>

        <section
          id="certifications"
          aria-label="Certifications"
          className="scroll-mt-20 border-t border-dashed px-6 py-6"
        >
          <p className="font-mono text-xs tracking-wider text-muted-foreground">
            Certifications
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            {resumeCertifications.map((cert) => (
              <li key={cert.name}>
                <span className="font-medium text-foreground">{cert.name}</span>{" "}
                — {cert.issuer}, {cert.year}
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Skills" className="border-t border-dashed px-6 py-6">
          <p className="font-mono text-xs tracking-wider text-muted-foreground">
            Skills and tools
          </p>
          <dl className="mt-2 space-y-1.5 text-sm">
            {resumeSkillGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                <dt className="w-28 shrink-0 font-medium text-foreground">
                  {group.label}
                </dt>
                <dd className="text-muted-foreground">{group.items}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <Footer />
    </>
  );
}
