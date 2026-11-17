import { skillLogos, skillsConfig, skillsSectionConfig } from "@/config/skills";
import Image from "next/image";
import type { SkillIcon, SkillItem } from "@/config/types";
import { cn } from "@/lib/utils";
import type { ComponentType } from "react";
import { FaAws } from "react-icons/fa";
import {
  SiApacheairflow,
  SiCplusplus,
  SiDbt,
  SiDocker,
  SiFastapi,
  SiGit,
  SiGrafana,
  SiJavascript,
  SiJira,
  SiLinux,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSnowflake,
  SiTypescript,
} from "react-icons/si";

type IconProps = { size: string };

function SqlIcon({ size }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="5.5" rx="8" ry="3" />
      <path d="M4 5.5v13c0 1.66 3.58 3 8 3s8-1.34 8-3v-13" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </svg>
  );
}

function PlSqlIcon({ size }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="5.5" rx="8" ry="3" fill="currentColor" opacity="0.25" />
      <path
        d="M4 5.5v13c0 1.66 3.58 3 8 3s8-1.34 8-3v-13M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9 8.5v7M9 8.5h2.4a1.8 1.8 0 0 1 0 3.6H9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OracleIcon({ size }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <ellipse cx="12" cy="12" rx="10" ry="6" fill="currentColor" opacity="0.16" />
    </svg>
  );
}

function PandasIcon({ size }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="3.5" y="4" width="2.6" height="16" rx="1.3" opacity="0.55" />
      <rect x="9" y="1.5" width="2.6" height="13" rx="1.3" />
      <rect x="14.5" y="7" width="2.6" height="14" rx="1.3" opacity="0.55" />
      <rect x="20" y="5" width="2.6" height="12" rx="1.3" />
    </svg>
  );
}

const skillIconMap: Record<SkillIcon, ComponentType<IconProps>> = {
  python: SiPython,
  sql: SqlIcon,
  plsql: PlSqlIcon,
  javascript: SiJavascript,
  typescript: SiTypescript,
  cpp: SiCplusplus,
  airflow: SiApacheairflow,
  snowflake: SiSnowflake,
  dbt: SiDbt,
  oracle: OracleIcon,
  postgres: SiPostgresql,
  pandas: PandasIcon,
  fastapi: SiFastapi,
  nodejs: SiNodedotjs,
  react: SiReact,
  docker: SiDocker,
  aws: FaAws,
  git: SiGit,
  linux: SiLinux,
  grafana: SiGrafana,
  jira: SiJira,
};

const enabledSkills = skillsConfig
  .filter((skill) => skill.enabled !== false)
  .sort((a, b) => a.order - b.order);

function SkillChip({ skill }: { skill: SkillItem }) {
  const Icon = skillIconMap[skill.icon];

  // Deliberately no hover:/focus-visible: styles here. These chips are labels,
  // not controls: there is nothing to click and nothing to focus.
  const chipClasses =
    "no-js-visible inline-flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-1 text-sm text-muted-foreground";

  return (
    <div className={chipClasses} aria-label={skill.name}>
      {skillLogos[skill.icon] ? (
        <Image src={skillLogos[skill.icon]!} alt="" width={18} height={18} className="size-[18px] shrink-0 object-contain" />
      ) : (
        <span className={skill.icon === "dbt" || skill.icon === "plsql" ? "text-destructive" : skill.icon === "aws" ? "text-chart-4" : "text-primary"}><Icon size="18" /></span>
      )}
      <span className="font-medium">{skill.name}</span>
    </div>
  );
}

export function Skills() {
  const skills = enabledSkills;
  const categories = skillsSectionConfig.categories;

  return (
    <section className="border-t border-dashed pt-6">
      <h2 className="no-js-visible section-heading">
        {skillsSectionConfig.title}
      </h2>
      {categories.map((category, groupIndex) => {
        const categorySkills = skills.filter(
          (skill) => skill.category === category.id,
        );

        if (categorySkills.length === 0) return null;

        return (
          <div
            key={category.id}
            className={cn(
              "flex flex-col gap-2.5 border-b px-6 py-3.5 sm:flex-row sm:items-center sm:gap-6",
              groupIndex === categories.length - 1 ? "border-none" : "",
            )}
          >
            <span className="w-36 shrink-0 font-mono text-xs tracking-wider text-muted-foreground">
              {`0${groupIndex + 1}`.padStart(2, "0") + " " + category.label}
            </span>

            <div className="flex flex-1 flex-wrap gap-2">
              {categorySkills.map((skill) => (
                <SkillChip key={skill.id} skill={skill} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
