export const nowConfig = {
  title: "Now",
  metaTitle: "Now",
  description:
    "What I'm building, coding with, reading, listening to, and playing right now.",
  updated: "2026-10-20",
  city: "Mumbai",
  intro:
    "Lately: data pipelines at work, Savory and Pixonomy after work, and a lot of time with coding agents.",
};

export type NowSection = {
  id: string;
  title: string;
  /** Paragraph copy shown before any items. */
  body?: string;
  items?: { label?: string; text: string; href?: string }[];
};

export const nowSections: NowSection[] = [
  {
    id: "work",
    title: "At work",
    body: "I'm a data engineer at ICICI Lombard in Mumbai. Most of my work is in Oracle: ETL pipelines, PL/SQL workflows, reporting data, and reconciliation.",
  },
  {
    id: "building",
    title: "What I'm building",
    items: [
      {
        label: "Savory",
        text: "a searchable library for X bookmarks, with folders, tags, notes, and on-device semantic search.",
        href: "https://getsavory.xyz",
      },
      {
        label: "Pixonomy",
        text: "a pixel-art property game in Godot for 2 to 6 players. Online, over a LAN, or on one PC.",
        href: "https://playpixopoly.com",
      },
      {
        label: "phonetocam",
        text: "turning an Android phone into a low-latency webcam for Windows, in Rust.",
      },
      {
        label: "This website",
        text: "getting the projects and writing into a shape I actually like.",
      },
    ],
  },
  {
    id: "coding",
    title: "What I'm coding with",
    body: "Claude Code CLI and Codex are my main coding agents right now, mostly with Claude Opus 5.5 and GPT 6.1 Sol. I'm also using OpenClaw and Hermes Agent. Locally, I run Qwen3 through Ollama on my Omarchy laptop, with Telegram as an interface for OpenClaw.",
    items: [
      {
        label: "Ollama setup",
        text: "running local models, start to finish.",
        href: "/blog/ollama-local-llms",
      },
      {
        label: "OpenClaw setup",
        text: "the agent-on-Telegram build, including the parts that needed fixing.",
        href: "/blog/openclaw-telegram-ollama",
      },
    ],
  },
];

/** Books, with the same covers the bookshelf uses. */
export const nowReading = [
  {
    id: "ddia",
    title: "Designing Data-Intensive Applications",
    creator: "Martin Kleppmann",
    image: "/img/now/ddia.jpg",
  },
  {
    id: "industrial-society",
    title: "Industrial Society and Its Future",
    creator: "Theodore Kaczynski",
    image: "/img/now/industrial-society.jpg",
  },
  {
    id: "sun-and-steel",
    title: "Sun and Steel",
    creator: "Yukio Mishima",
    image: "/img/now/sun-and-steel.jpg",
  },
];

export const nowListening = {
  blurb:
    "Michael Jackson, The Strokes, EsDeeKid, and Daft Punk have been in the rotation.",
  items: [
    { id: "bad", title: "Bad", creator: "Michael Jackson", image: "/img/now/bad.jpg" },
    { id: "reality-awaits", title: "Reality Awaits", creator: "The Strokes", image: "/img/now/reality-awaits.jpg" },
    { id: "rebel", title: "Rebel", creator: "EsDeeKid", image: "/img/now/rebel.jpg" },
    { id: "discovery", title: "Discovery", creator: "Daft Punk", image: "/img/now/discovery.jpg" },
  ],
};

export const nowPlaying = {
  blurb:
    "CS2 on weekends, with Monster Hunter Rise, Balatro, and Black Flag in the rotation.",
  items: [
    { id: "cs2", title: "Counter-Strike 2", creator: "Valve", image: "/img/now/cs2.jpg" },
    { id: "mh-rise", title: "Monster Hunter Rise", creator: "Capcom", image: "/img/now/mh-rise.jpg" },
    { id: "balatro", title: "Balatro", creator: "LocalThunk", image: "/img/now/balatro.jpg" },
    { id: "black-flag", title: "Black Flag Resynced", creator: "Ubisoft", image: "/img/now/black-flag.jpg" },
  ],
};
