import type { MetadataRoute } from "next";
import type { ComponentType, SVGProps } from "react";

export type SectionId =
  | "socials"
  | "skills"
  | "about"
  | "projects"
  | "writing"
  | "experience"
  | "services"
  | "workflow"
  | "github"
  | "bookmarks"
  | "bookshelf"
  | "certifications"
  | "contact";

export interface SectionFlags {
  [key: string]: boolean;
}

export interface SectionNoteConfig {
  text: string;
  side: "left" | "right";
}

export interface SiteMetaConfig {
  url: string;
  title: string;
  titleTemplate: string;
  shortTitle: string;
  description: string;
  keywords: string[];
  authors: Array<{ name: string; url: string }>;
  creator: string;
  publisher: string;
  classification: string;
  category: string;
  locale: string;
  ogImage: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
  twitterCreator: string;
  icon: string;
  appleIcon: string;
  googleVerification: string;
  manifest: MetadataRoute.Manifest;
  robots: MetadataRoute.Robots;
  sitemap: Array<{
    url: string;
    changeFrequency:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never";
    priority: number;
  }>;
}

export interface PersonalInfo {
  fullName: string;
  firstName: string;
  avatar: {
    src: string;
    alt: string;
    fallback: string;
  };
  location: {
    label: string;
    timeZone: string;
  };
  githubUsername: string;
}

export interface HeroConfig {
  greeting: string;
  waveEmoji: string | React.ElementType;
  headline: string;
  description: string;
}

export interface ProfileBannerSticker {
  id: "notebook" | "keyboard" | "plane" | "coffee";
  src: string;
  alt: string;
  label: string;
  tilt: number;
  order: number;
  soundSrc?: string;
}

export interface AboutConfig {
  title: string;
  body: string;
}

export interface FooterConfig {
  quote: string;
  attribution: string;
  credit: string;
  artwork: {
    src: string;
    width: number;
    height: number;
  };
}

export type AboutGreetings = Record<"morning" | "afternoon" | "evening", string>;

export interface AboutItem {
  id: string;
  lead: string;
  illustration: "browser" | "notebook" | "plane";
  body: string;
}

export type SkillCategory =
  | "language"
  | "data"
  | "backend"
  | "frontend"
  | "tools";
export interface SkillCategoryConfig {
  id: SkillCategory;
  label: string;
}

export interface SkillItem {
  id: string;
  name: string;
  icon: SkillIcon;
  category: SkillCategory;
  order: number;
  enabled?: boolean;
}

export type SkillIcon =
  | "python"
  | "sql"
  | "plsql"
  | "javascript"
  | "typescript"
  | "cpp"
  | "airflow"
  | "snowflake"
  | "dbt"
  | "oracle"
  | "postgres"
  | "pandas"
  | "fastapi"
  | "nodejs"
  | "react"
  | "docker"
  | "aws"
  | "git"
  | "linux"
  | "grafana"
  | "jira";

export interface SocialLink {
  id: string;
  platform: string;
  handle: string;
  href?: string;
  icon: SocialIcon;
  order: number;
  enabled?: boolean;
  action?: "copy" | "external" | "mailto";
  copyValue?: string;
  shortcutKey?: string;
  tooltipDefault?: string;
}

export type SocialIcon =
  | "github"
  | "x"
  | "peerlist"
  | "discord"
  | "gmail"
  | "reddit"
  | "linkedin"
  | "rss";

export interface ProjectMetric {
  icon: "users" | "chart";
  label: string;
}

export type ProjectStatus = "building" | "new" | "shipped";

export interface Project {
  id: string;
  title: string;

  description: string;
  content?: string;
  image: string;
  imageAlt: string;
  liveUrl?: string;
  githubUrl?: string;

  year: number;
  status: ProjectStatus;
  category: string;

  tags: string[];
  metrics?: ProjectMetric[];
  order: number;
  enabled?: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  summary: string;
  highlights?: string[];
  order: number;
  enabled?: boolean;
}

export interface ListSectionConfig {
  title: string;
  items: string[];
}

export type WorkflowIcon = "scope" | "communication" | "handoff";

export interface WorkflowItem {
  label: string;
  description: string;
  icon?: WorkflowIcon;
}

export interface PricingAnchor {
  label: string;
  value: string;
  note: string;
}

export interface ContactConfig {
  title: string;
  description: string;
  pricing: PricingAnchor[];
  channels: SocialLink[];
}

export type LinkCardIcon = ComponentType<
  SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
  }
>;

export interface BookmarksConfig {
  title: string;
  items: Bookmark[];
}

export interface CertificationsConfig {
  title: string;
  items: Certification[];
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  domain: string;
  icon?: LinkCardIcon;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: { src: string; width: number; height: number; alt: string };
  /** Original book page and the exact source of the locally stored artwork. */
  sourceUrl: string;
  coverSourceUrl: string;
  spine: {
    src: string;
    height: number;
    width: number;
    sourceUrl?: string;
  };
  order: number;
  enabled?: boolean;
}

export interface Certification {
  id: string;
  url: string;
  title: string;
  domain: string;
  date?: string;
  icon?: LinkCardIcon;
}

export interface SiteNavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  order: number;
}

export interface PortfolioConfig {
  meta: SiteMetaConfig;
  personal: PersonalInfo;
  sectionOrder: SectionId[];
  sectionFlags: Record<SectionId, boolean>;
  bookmarks: BookmarksConfig;
  certifications: CertificationsConfig;
  banner: {
    imageSrc: string;
    imageAlt: string;
    openSourceUrl: string;
    openSourceTooltip: string;
    themeToggleLabel: string;
    themeShortcut: string;
    themeTooltip: string;
    switchAudioSrc: string;
  };
  about: AboutConfig;
  services: ListSectionConfig;
  workflow: {
    title: string;
    items: WorkflowItem[];
  };
  contact: ContactConfig;
}


