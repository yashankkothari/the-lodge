export const resumeSectionConfig = {
  title: "Experience",
  intro:
    "Data engineering, useful software, and learning by building.",
  resumePdf: "/img/yashank-kothari-resume.pdf",
  resumeLabel: "Download resume",
  printLabel: "Print this page",
  linkedinLabel: "LinkedIn",
  linkedinHref: "https://www.linkedin.com/in/yashankkothari/",
};

export const resumeRoles = [
  {
    id: "icici-lombard",
    company: "ICICI Lombard",
    logo: "/img/logos/icici-lombard.png",
    period: "Jul 2026 — Present",
    location: "Mumbai, India",
    role: "Data Engineer",
    points: [
      "Build and maintain PL/SQL stored procedures and Oracle data pipelines behind insurance reporting.",
      "Write and tune the SQL that feeds daily loads and business KPIs.",
      "Reconcile data between transactional (OLTP) and reporting (OLAP) systems so the numbers match.",
      "Work with business and analytics teams to turn reporting requests into reliable data.",
    ],
  },
  {
    id: "colgate",
    company: "Colgate Palmolive",
    logo: "/img/logos/colgate-palmolive.png",
    period: "Jan 2026 — Jun 2026",
    location: "Mumbai, India",
    role: "Data Engineering Intern",
    points: [
      "Built 30+ idempotent Apache Airflow pipelines moving high-volume data from Google Cloud Storage to Snowflake.",
      "Designed multiple Medallion data models (Staging, Curated, Consumption) in dbt and Jinja-templated SQL, powering BI reporting in Domo and Sigma.",
      "Helped migrate 20+ tables in the SAP ECC to SAP S/4HANA move, remediating legacy tables and validating for zero-defect production data.",
      "Trained and tuned the model behind a Retool AI natural-language query tool spanning 15+ tables.",
    ],
  },
  {
    id: "card91",
    company: "Card91",
    logo: "/img/logos/card91.png",
    period: "Jun 2025 — Jul 2025",
    location: "Bangalore, India",
    role: "AI/ML Intern",
    points: [
      "Researched real-time fraud detection for UPI-style P2P and P2B payments: rule engines, anomaly detection and ML scoring.",
      "Evaluated the open-source Tazama fraud engine for adoption, studying its TypeScript rule logic against Card91's payment flows.",
      "Delivered recommendations and an implementation plan for bringing Tazama into real-time transaction monitoring.",
    ],
  },
] as const;

export const resumeLeadership = {
  id: "kjscE",
  company: "KJSCE Students' Council",
  period: "Jul 2023 — Jul 2025",
  role: "Creative Head",
  points: [
    "Led all art and creative work for the Students' Council, running a team of 8 designers across two years.",
    "Set the creative direction for 15+ college fests drawing a combined footfall of 50,000, including Symphony, Abhiyantriki and Skream.",
    "Designed each fest's full visual identity: branding, banners, posters, social content, launch videos, stickers, caps and merch.",
    "Earlier: Jt. Creative Head, KJSCE SAHAS (Nov 2022 — Sep 2023).",
  ],
} as const;

export const resumeEducation = {
  school: "K.J. Somaiya College of Engineering, Mumbai",
  period: "Oct 2022 — May 2026",
  degree: "B.Tech, Computer Engineering",
  honours: "Honours in Data Science",
} as const;

export const resumeCertifications = [
  { name: "AI Receptive Software Development", issuer: "Clemson University", year: "2025" },
  { name: "Neural Networks and Deep Learning", issuer: "DeepLearning.AI", year: "2024" },
  { name: "AWS Cloud Technical Essentials", issuer: "Amazon Web Services", year: "2024" },
] as const;

export const resumeSkillGroups = [
  {
    label: "Languages",
    items: "Python, SQL, PL/SQL, NoSQL, JavaScript, HTML/CSS, C++",
  },
  {
    label: "Data",
    items: "Apache Airflow, Snowflake, dbt, Oracle, PostgreSQL, Domo, Sigma Analytics, Grafana",
  },
  { label: "Frameworks", items: "React, React Native, Node.js, FastAPI, REST APIs" },
  { label: "Tools", items: "AWS (RDS), Git, Jira, Docker, Linux, VS Code" },
  { label: "Libraries", items: "pandas, NumPy, Matplotlib" },
] as const;
