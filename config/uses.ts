export const usesConfig = {
  title: "Uses",
  headline: "The things I build with",
  allLabel: "All",
  filterLabel: "Filter by category",
  relatedTitle: "From the workbench",
  galleryNote: "A small inventory of everyday tools, illustrated in paper cut.",
  metaTitle: "Uses",
  description:
    "The hardware, software, ML stack, and current models and agents on my desk.",
  intro:
    "The tools on the workbench. Nothing here is sponsored; most of it was chosen at 2 a.m.",
  updated: "2026-10-20",
};

/** A single piece of gear. `art` keys into `components/landing/uses-art.tsx`. */
export type UsesItem = {
  id: string;
  /** The product or tool name, shown as the card title. */
  name: string;
  /** What it is or what I use it for. */
  note?: string;
  /** Paper-cut illustration key. Falls back to a generic block. */
  art: string;
};

export type UsesGroup = {
  id: string;
  title: string;
  filterLabel?: string;
  art?: string;
  /** Optional lead paragraph before the grid. */
  body?: string;
  items: UsesItem[];
  /** Rendered as a definition list instead of cards, for lists of tools. */
  plain?: { label: string; value: string }[];
};

export const usesGroups: UsesGroup[] = [
  {
    id: "desk",
    title: "Desk",
    items: [
      {
        id: "machine",
        name: "Ryzen 5 5600X build",
        note: "32 GB DDR4, Gigabyte Radeon RX 9060 XT 16 GB",
        art: "tower",
      },
      {
        id: "monitors",
        name: "BenQ EW270Q",
        note: "Side by side with a Gigabyte G24F",
        art: "monitor",
      },
      {
        id: "keyboard",
        name: "Cosmic Byte mechanical",
        note: "In white",
        art: "keyboard",
      },
      { id: "mouse", name: "Razer Orochi V2", art: "mouse" },
      {
        id: "headphones",
        name: "Razer BlackShark V2 X",
        note: "For Badalamenti, mostly",
        art: "headphones",
      },
      { id: "speakers", name: "Creative Pebble V3", art: "speaker" },
      { id: "mic", name: "Blue Snowball iCE", art: "microphone" },
      { id: "tablet", name: "iPad Air 2", art: "tablet" },
    ],
  },
  {
    id: "editor",
    filterLabel: "Editor",
    art: "terminal",
    title: "Editor and terminal",
    body: "Neovim and VS Code, kitty for a terminal, and Git for everything that survives.",
    plain: [
      { label: "Editors", value: "Neovim and VS Code" },
      { label: "Terminal", value: "kitty" },
      { label: "Version control", value: "Git, GitHub" },
    ],
    items: [],
  },
  {
    id: "models",
    filterLabel: "Models",
    title: "Models and agents",
    body: "Opus 5.5 and GPT 6.1 Sol are the models I reach for most right now. I also use OpenClaw and Hermes Agent, alongside a local Ollama setup.",
    items: [
      {
        id: "local",
        name: "Ollama with Qwen3",
        note: "Local inference on the Omarchy laptop",
        art: "neural",
      },
      {
        id: "agents",
        name: "Claude Code CLI and Codex",
        note: "The coding agents I use daily",
        art: "terminal",
      },
      {
        id: "openclaw",
        name: "OpenClaw and Hermes Agent",
        note: "Telegram as the chat interface",
        art: "blocks",
      },
    ],
  },
  {
    id: "ml",
    filterLabel: "ML and AI",
    art: "neural",
    title: "Machine learning and applied AI",
    body: "Python for the modelling, MediaPipe and MobileNetV2 when the problem is visual, Flask or FastAPI to serve it, and nomic-embed-text when it needs retrieval.",
    plain: [
      { label: "Core stack", value: "Python, NumPy, pandas, Matplotlib" },
      {
        label: "Computer vision",
        value: "MediaPipe Model Maker and MobileNetV2 for image classification",
      },
      { label: "Inference APIs", value: "Flask and FastAPI" },
      {
        label: "LLM applications",
        value: "Google Gemini, local models through Ollama, structured outputs",
      },
      {
        label: "Embeddings and retrieval",
        value: "nomic-embed-text, semantic search, RAG pipelines",
      },
      { label: "Evaluation", value: "Python scripts for model and retrieval quality" },
      { label: "Fraud detection", value: "Tazama (evaluated), rule engines" },
    ],
    items: [],
  },
  {
    id: "data",
    filterLabel: "Data",
    title: "Data work",
    body: "The day job lives here: Oracle and PL/SQL at the center, Airflow and dbt moving the data, and a BI layer on top.",
    items: [
      {
        id: "oracle",
        name: "Oracle and PL/SQL",
        note: "Reporting pipelines and reconciliation",
        art: "database",
      },
      {
        id: "snowflake",
        name: "Snowflake and dbt",
        note: "Medallion models with Jinja-templated SQL",
        art: "database",
      },
      {
        id: "airflow",
        name: "Apache Airflow",
        note: "Idempotent batch pipelines",
        art: "blocks",
      },
    ],
  },
  {
    id: "building",
    filterLabel: "Building",
    art: "blocks",
    title: "Building things",
    body: "React and Next.js on the web, React Native with Expo on mobile, Docker when it needs to run somewhere else.",
    plain: [
      { label: "Web", value: "React, Next.js, Node.js, FastAPI" },
      { label: "Mobile", value: "React Native with Expo" },
      { label: "Containers", value: "Docker" },
      { label: "This site", value: "Next.js, Tailwind, and Motion" },
    ],
    items: [],
  },
];

/** Cross-links shown under the groups. */
export const usesLinks = [
  { label: "local Ollama setup", href: "/blog/ollama-local-llms" },
  { label: "OpenClaw over Telegram", href: "/blog/openclaw-telegram-ollama" },
  { label: "OncoLytix", href: "/project/oncolytix" },
  { label: "TrueHire", href: "/project/truehire" },
];
