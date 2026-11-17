import type { SkillCategoryConfig, SkillIcon, SkillItem } from "@/config/types";

export const skillLogos: Partial<Record<SkillIcon, string>> = {
  python: "/images/stack/python.svg",
  javascript: "/images/stack/javascript.svg",
  typescript: "/images/stack/typescript.svg",
  cpp: "/images/stack/cplusplus.svg",
  airflow: "/images/stack/apacheairflow.svg",
  snowflake: "/images/uses/snowflake.svg",
  oracle: "/images/stack/oracle.svg",
  postgres: "/images/stack/postgresql.svg",
  pandas: "/images/stack/pandas.svg",
  fastapi: "/images/stack/fastapi.svg",
  nodejs: "/images/stack/nodejs.svg",
  react: "/images/stack/react.svg",
  docker: "/images/stack/docker.svg",
  git: "/images/stack/git.svg",
  linux: "/images/stack/linux.svg",
  grafana: "/images/stack/grafana.svg",
  jira: "/images/stack/jira.svg",
};

export const skillsSectionConfig = {
  title: "Stack",
  categories: [
    { id: "language", label: "Language" },
    { id: "data", label: "Data" },
    { id: "backend", label: "Backend" },
    { id: "tools", label: "Tools" },
  ] as SkillCategoryConfig[],
};

export const skillsConfig: SkillItem[] = [
  // Language
  { id: "python", name: "Python", icon: "python", category: "language", order: 1, enabled: true },
  { id: "sql", name: "SQL", icon: "sql", category: "language", order: 2, enabled: true },
  { id: "plsql", name: "PL/SQL", icon: "plsql", category: "language", order: 3, enabled: true },
  { id: "javascript", name: "JavaScript", icon: "javascript", category: "language", order: 4, enabled: true },
  { id: "typescript", name: "TypeScript", icon: "typescript", category: "language", order: 5, enabled: true },
  { id: "cpp", name: "C++", icon: "cpp", category: "language", order: 6, enabled: true },

  // Data
  { id: "airflow", name: "Airflow", icon: "airflow", category: "data", order: 7, enabled: true },
  { id: "snowflake", name: "Snowflake", icon: "snowflake", category: "data", order: 8, enabled: true },
  { id: "dbt", name: "dbt", icon: "dbt", category: "data", order: 9, enabled: true },
  { id: "oracle", name: "Oracle", icon: "oracle", category: "data", order: 10, enabled: true },
  { id: "postgres", name: "PostgreSQL", icon: "postgres", category: "data", order: 11, enabled: true },
  { id: "pandas", name: "pandas", icon: "pandas", category: "data", order: 12, enabled: true },

  // Backend
  { id: "fastapi", name: "FastAPI", icon: "fastapi", category: "backend", order: 13, enabled: true },
  { id: "nodejs", name: "Node.js", icon: "nodejs", category: "backend", order: 14, enabled: true },
  { id: "react", name: "React", icon: "react", category: "backend", order: 15, enabled: true },
  { id: "docker", name: "Docker", icon: "docker", category: "backend", order: 16, enabled: true },

  // Tools
  { id: "aws", name: "AWS", icon: "aws", category: "tools", order: 17, enabled: true },
  { id: "git", name: "Git", icon: "git", category: "tools", order: 18, enabled: true },
  { id: "linux", name: "Linux", icon: "linux", category: "tools", order: 19, enabled: true },
  { id: "grafana", name: "Grafana", icon: "grafana", category: "tools", order: 20, enabled: true },
  { id: "jira", name: "Jira", icon: "jira", category: "tools", order: 21, enabled: true },
];
