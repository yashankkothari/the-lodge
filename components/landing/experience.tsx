"use client";

import { experienceConfig, experienceSectionConfig } from "@/config/experience";
import { ExperienceText } from "@/components/shared/experience-text";

const enabledExperience = experienceConfig
  .filter((item) => item.enabled !== false)
  .sort((a, b) => a.order - b.order);

export function Experience() {
  if (!enabledExperience.length) {
    return null;
  }

  return (
    <section className="border-t border-dashed pt-6">
      <h2 className="section-heading mb-3">{experienceSectionConfig.title}</h2>
      <div className="px-6 space-y-4">
        {enabledExperience.map((item) => (
          <article
            key={item.id}
            className="micro-transition border border-dashed p-4 hover:bg-muted/20 focus-within:bg-muted/20 motion-safe:hover:translate-x-0.5"
          >
            <h3 className="text-base font-semibold">{item.role}</h3>
            <p className="text-sm text-muted-foreground">
              {item.company} ·{" "}
              <span className="font-mono text-xs">{item.period}</span>
            </p>
            <p className="mt-2 text-sm font-medium text-foreground"><ExperienceText>{item.highlights?.[0] ?? item.summary}</ExperienceText></p>
            {item.highlights?.length ? <p className="mt-1 text-sm text-muted-foreground"><ExperienceText>{item.summary}</ExperienceText></p> : null}
            {item.highlights && item.highlights.length > 1 ? (
              <ul className="mt-2 list-disc pl-4 text-sm text-muted-foreground space-y-1">
                {item.highlights.slice(1).map((highlight) => (
                  <li key={highlight}><ExperienceText>{highlight}</ExperienceText></li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
