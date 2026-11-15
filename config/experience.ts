import type { ExperienceItem } from "@/config/types";

export const experienceSectionConfig = {
  title: "Experience",
};

export const experienceConfig: ExperienceItem[] = [
  {
    id: "icici-lombard",
    role: "Data Engineer",
    company: "ICICI Lombard",
    period: "Jul 2026 — Present",
    summary:
      "Building the Oracle data pipelines and reporting workflows behind insurance reporting.",
    highlights: [
      "Build and maintain PL/SQL stored procedures and Oracle data pipelines.",
      "Reconcile data between OLTP and reporting systems so the numbers match.",
    ],
    order: 1,
    enabled: true,
  },
  {
    id: "colgate-palmolive",
    role: "Data Engineering Intern",
    company: "Colgate Palmolive",
    period: "Jan 2026 — Jun 2026",
    summary:
      "Shipped idempotent Airflow pipelines and Medallion data models in dbt on Snowflake.",
    highlights: [
      "Built 30+ idempotent Apache Airflow pipelines moving high-volume data from GCS to Snowflake.",
      "Migrated 20+ tables in the SAP ECC to S/4HANA move and validated for zero-defect production data.",
    ],
    order: 2,
    enabled: true,
  },
  {
    id: "card91",
    role: "AI/ML Intern",
    company: "Card91",
    period: "Jun 2025 — Jul 2025",
    summary:
      "Researched real-time fraud detection for UPI-style P2P and P2B payments.",
    highlights: [
      "Evaluated the open-source Tazama fraud engine against Card91's payment flows.",
      "Delivered recommendations and an implementation plan for real-time transaction monitoring.",
    ],
    order: 3,
    enabled: true,
  },
  {
    id: "kjscE-creative-head",
    role: "Creative Head",
    company: "KJSCE Students' Council",
    period: "Jul 2023 — Jul 2025",
    summary:
      "Led all art and creative work for the Students' Council across two years.",
    highlights: [
      "Ran a team of 8 designers and set creative direction for 15+ college fests.",
      "Designed full visual identities: branding, banners, posters, launch videos, and merch.",
    ],
    order: 4,
    enabled: true,
  },
];
