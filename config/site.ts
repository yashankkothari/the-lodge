import { socialsConfig } from "@/config/socials";
import type { AboutGreetings, AboutItem, FooterConfig, PortfolioConfig } from "@/config/types";
import BrandNextjs from "@/public/stacks/nextjs";
import { BookmarkCheckIcon } from "@/components/shared/site-icons";

export const aboutGreetings: AboutGreetings = {
  morning: "Good morning !",
  afternoon: "Good afternoon !",
  evening: "Good evening !",
};

export const aboutItems: AboutItem[] = [
  {
    id: "work",
    lead: "I'm Yashank, a data engineer in Mumbai",
    illustration: "browser",
    body: "building ETL pipelines, reporting workflows, and the data reconciliation that keeps numbers honest.",
  },
  {
    id: "build",
    lead: "Outside work I build things I want to use",
    illustration: "notebook",
    body: "a searchable home for saved posts, a pixel-art game to play with friends, and tools around local language models.",
  },
  {
    id: "learn",
    lead: "I write about pipelines, backends, and applied ML",
    illustration: "plane",
    body: "usually with code, diagrams, and a reason for choosing one approach over another.",
  },
];

export const footerConfig: FooterConfig = {
  quote: "Waste no more time arguing what a good man should be. Be one.",
  attribution: "Marcus Aurelius",
  credit: "Built with Next.js and far too much coffee.",
  artwork: {
    src: "/images/footer-garden-strip.webp",
    width: 1264,
    height: 600,
  },
};

export const siteConfig: PortfolioConfig = {
  meta: {
    url: "https://yashank.site",
    title: "Yashank Kothari — Data Engineer & Builder",
    titleTemplate: "%s | Yashank Kothari",
    shortTitle: "Yashank Kothari",
    description:
      "Yashank Kothari is a data engineer in Mumbai building data systems, software, and the occasional game.",
    keywords: [
      "Data Engineer",
      "Data Engineering",
      "ETL Pipelines",
      "Apache Airflow",
      "dbt",
      "Snowflake",
      "Oracle",
      "PL/SQL",
      "Applied ML",
      "Next.js",
      "Mumbai",
      "India",
      "Yashank",
      "Yashank Kothari",
    ],
    authors: [{ name: "Yashank Kothari", url: "https://yashank.site" }],
    creator: "Yashank Kothari",
    publisher: "Yashank Kothari",
    classification: "Portfolio",
    category: "technology",
    locale: "en_US",
    ogImage: {
      url: "/opengraph-image",
      width: 1200,
      height: 630,
      alt: "Yashank Kothari, data engineer in Mumbai",
    },
    twitterCreator: "@yashankkothari",
    icon: "/favicon-32.png",
    appleIcon: "/apple-touch-icon.png",
    googleVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
    manifest: {
      name: "Yashank Kothari — Data Engineer & Builder",
      short_name: "Yashank",
      description: "Data systems, software, and the occasional game.",
      start_url: "/",
      display: "standalone",
      background_color: "#fafafa",
      theme_color: "#18181b",
      icons: [
        {
          src: "/favicon.ico",
          sizes: "any",
          type: "image/x-icon",
        },
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    robots: {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      sitemap: "https://yashank.site/sitemap.xml",
    },
    sitemap: [
      { url: "https://yashank.site", changeFrequency: "monthly", priority: 1 },
      {
        url: "https://yashank.site/blog",
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: "https://yashank.site/resume",
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: "https://yashank.site/portfolio",
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: "https://yashank.site/now",
        changeFrequency: "monthly",
        priority: 0.6,
      },
      {
        url: "https://yashank.site/uses",
        changeFrequency: "monthly",
        priority: 0.6,
      },
    ],
  },
  personal: {
    fullName: "Yashank Kothari",
    firstName: "Yashank",
    avatar: {
      src: "/images/profile-monogram.svg",
      alt: "Hand-lettered yk monogram for Yashank Kothari",
      fallback: "YK",
    },
    location: {
      label: "Mumbai, India",
      timeZone: "Asia/Kolkata",
    },
    githubUsername: "yashankkothari",
  },
  sectionOrder: [
    "projects",
    "writing",
    "socials",
    "about",
    "github",
    "experience",
    "skills",
    "bookshelf",
    "bookmarks",
    "certifications",
  ],
  sectionFlags: {
    socials: true,
    skills: true,
    about: true,
    projects: true,
    writing: true,
    bookmarks: true,
    bookshelf: true,
    certifications: true,
    experience: true,
    services: false,
    workflow: false,
    github: true,
    contact: false,
  },
  banner: {
    imageSrc: "/images/desk-stickers.webp",
    imageAlt: "Paper-cut cutouts of a database, a terminal, a chart, and a coffee cup",
    openSourceUrl: "https://github.com/yashankkothari/the-lodge",
    openSourceTooltip: "This site is open source!",
    themeToggleLabel: "Toggle theme",
    themeShortcut: "D",
    themeTooltip: "Toggle theme",
    switchAudioSrc: "/switch.mp3",
  },
  about: {
    title: "Hello there !",
    body: aboutItems.map(({ lead, body }) => `${lead} ${body}`).join(" "),
  },
  services: {
    title: "What I build best",
    items: [
      "Batch and near real-time pipelines that land clean, reconciled data where analysts can use it.",
      "Reporting layers and data models in dbt, Snowflake, and Oracle that survive a schema change.",
      "Small tools around models and data: retrieval, evaluation, and the glue that makes them useful.",
    ],
  },
  workflow: {
    title: "How I work",
    items: [
      {
        label: "Scope",
        description:
          "Agree on the metric that matters and the tables behind it before writing any SQL.",
        icon: "scope",
      },
      {
        label: "Idempotency",
        description:
          "Every job can rerun safely. Backfills stop being an incident and become a command.",
        icon: "communication",
      },
      {
        label: "Handoff",
        description:
          "Documented lineage, tests, and alerts, so the next person can own it without a call.",
        icon: "handoff",
      },
    ],
  },
  contact: {
    title: "Say hello",
    description:
      "I write about data pipelines, backend systems, and applied ML, and I am always up for talking about a hard data problem.",
    pricing: [
      {
        label: "Open to",
        value: "Data engineering roles",
        note: "Pipelines, warehouse modelling, and platform work.",
      },
      {
        label: "Also open to",
        value: "Contract builds",
        note: "Scoped pipeline or reporting work with a clear owner.",
      },
      {
        label: "Fastest way",
        value: "Email",
        note: "kothariyashank@gmail.com reaches me directly.",
      },
    ],
    channels: socialsConfig.filter((item) =>
      ["email", "github", "linkedin"].includes(item.id),
    ),
  },
  bookmarks: {
    title: "Bookmarks",

    items: [
      {
        id: "1",
        url: "https://dataintensive.net/",
        title: "Designing Data-Intensive Applications",
        domain: "dataintensive.net",
        icon: BookmarkCheckIcon,
      },
      {
        id: "2",
        url: "https://arxiv.org/abs/1706.03762",
        title: "Attention Is All You Need",
        domain: "arxiv.org",
        icon: BookmarkCheckIcon,
      },
      {
        id: "3",
        url: "/blog/idempotent-pipelines",
        title: "Idempotent Pipelines: Making the 3 a.m. Rerun Safe",
        domain: "yashank.site",
        icon: BookmarkCheckIcon,
      },
      {
        id: "4",
        url: "/blog/airflow-dag-design",
        title: "Designing Airflow DAGs That Don't Wake You Up",
        domain: "yashank.site",
        icon: BookmarkCheckIcon,
      },
      {
        id: "5",
        url: "/blog/evaluating-llm-apps",
        title: "Evaluating LLM Apps: Treat Prompts Like Pipelines",
        domain: "yashank.site",
        icon: BookmarkCheckIcon,
      },
      {
        id: "6",
        url: "/blog/fastapi-in-production",
        title: "FastAPI in Production: The Things the Tutorial Skips",
        domain: "yashank.site",
        icon: BookmarkCheckIcon,
      },
    ],
  },
  certifications: {
    title: "Certificates",
    items: [
      {
        id: "certificate-1",
        url: "/resume#certifications",
        title: "AI Receptive Software Development",
        domain: "Clemson University",
        date: "2025",
        icon: BrandNextjs,
      },
      {
        id: "certificate-2",
        url: "/resume#certifications",
        title: "Neural Networks and Deep Learning",
        domain: "DeepLearning.AI",
        date: "2024",
        icon: BookmarkCheckIcon,
      },
      {
        id: "certificate-3",
        url: "/resume#certifications",
        title: "AWS Cloud Technical Essentials",
        domain: "Amazon Web Services",
        date: "2024",
        icon: BookmarkCheckIcon,
      },
    ],
  },
};
