import type { Project } from "@/config/types";

export const projectsSectionConfig = {
  title: "Projects",
  liveButtonLabel: "Visit",
  liveTooltip: "Open project",
  description: "Things I build to make the everyday more useful, or more fun.",
  allProjectsLabel: "All projects",
  featuredActions: { savory: "Try Savory", pixopoly: "Visit Pixonomy" } as Record<string, string>,
  caseStudyLabel: "Case study",
  statusLabels: { building: "In development", new: "New", shipped: "Live" },
};

export const homeProjectsConfig = {
  ids: ["savory", "pixopoly"],
  previews: {
    savory: { src: "/img/projects/savory-search.jpg", alt: "Savory finding saved posts with semantic search" },
    pixopoly: { src: "/img/projects/pixopoly-og.jpg", alt: "Pixonomy's pixel-art game board and logo" },
  } as Record<string, { src: string; alt: string }>,
};

export const projectsConfig: Project[] = [
  {
    id: "savory",
    title: "Savory — Searchable library for X bookmarks",
    description:
      "A free browser extension that turns your X bookmarks into an organized, searchable library, live on the Chrome Web Store.",
    content:
      "## Problem\nX is where you find great ideas, and its bookmarks are where they disappear: one endless list with no search, no folders and no way to remember why you saved something.\n\n## What it does\n- **Save with context:** hit bookmark on any post and a small panel appears right on x.com to add tags, pick a folder and jot a note.\n- **Search by meaning:** find the post you're thinking of even when it uses different words, plus instant full-text search across posts, links, authors, tags and notes.\n- **Folders, tags and notes:** colour-coded folders, automatic topic tags, and a searchable note on every bookmark.\n- **Media gallery:** every saved image, video and GIF on one wall, with a full-screen viewer and original-quality downloads.\n- **Live sync:** imports your whole bookmark history on its own, then picks up new bookmarks within seconds, including ones saved on your phone.\n- **Private by design:** no account, no servers, no tracking. Everything stays in your browser, and you can export it any time.\n\n## Status\nLive and free on the Chrome Web Store, working in Chrome, Edge, Brave and Arc. A Pro plan with AI summaries, Q&A over your bookmarks and sync is on the way.",
    image: "/img/projects/savory-promo.jpg",
    imageAlt: "Savory: organize everything you save on X",
    liveUrl: "https://getsavory.xyz",
    tags: ["Chrome Extension", "TypeScript", "Semantic Search", "React"],
    metrics: [
      { icon: "chart", label: "Live on Chrome Web Store" },
      { icon: "users", label: "100% private, on device" },
    ],
    year: 2026,
    status: "shipped",
    category: "Browser extension",
    order: 1,
    enabled: true,
  },
  {
    id: "pixopoly",
    title: "Pixonomy — Pixel-art property trading game",
    description:
      "My pixel-art property trading game. Buy the world, bankrupt your friends. Coming soon to Steam.",
    content:
      "## The idea\nRoll. Buy. Build. Repeat. Pixonomy keeps the buy-the-world fantasy of classic property games and fixes the parts that make people quit halfway: one runaway leader, long dead turns and trades nobody trusts.\n\n## Features\n- **Real cities, drawn in pixels:** Paris, Tokyo, Rio, Istanbul, Cairo, Toronto, Mumbai and more.\n- **Play with friends:** 2 to 6 players online, on a local network or on one couch, with CPU opponents to fill seats.\n- **Dice, deals and a little betrayal:** auctions, and trades that can carry promises like rent-free visits and IOUs.\n- **Twists:** ability cards, Chaos Mode, secret missions, 2v2 teams and underdog rules that keep everyone in the game.\n\n## Status\nIn development and coming soon to Steam.",
    image: "/img/projects/pixopoly-og.jpg",
    imageAlt: "Pixonomy logo over the game board mid-game",
    liveUrl: "https://playpixopoly.com",
    tags: ["Godot", "GDScript", "Pixel Art", "Multiplayer", "Game"],
    metrics: [
      { icon: "users", label: "2 to 6 players" },
      { icon: "chart", label: "Online, LAN, or one couch" },
    ],
    year: 2026,
    status: "building",
    category: "Game",
    order: 2,
    enabled: true,
  },
  {
    id: "notesaid",
    title: "NotesAid — Open-source study companion",
    description:
      "An open-source study companion that 2,700+ students found on their own.",
    content:
      "## Problem\nEvery semester, the same scramble: notes scattered across group chats, drives, and photos of whiteboards taken at bad angles. Students wanted one place to find the right material for the right subject, and they wanted it to work on a phone in a crowded bus.\n\n## What I built\nNotesAid organizes study material by course and module in a fast, searchable interface. It installs as a Progressive Web App, so it opens like a native app and keeps working when the connection drops.\n- **Next.js + React + TypeScript** front end, statically generated for speed.\n- **A content workflow** that lets new material be added without touching the app code, so updates can ship in minutes.\n- **PWA setup** with offline caching and a responsive layout tuned for phones.\n\n## Results\nThe beta launched on 24 February 2025. In a single semester it reached over 17,000 views and 2,700 unique users, who spent more than 1,500 hours in it combined. I then made it open source, and the project has received more than 60 pull requests from the community.",
    image: "/img/projects/notesaid-home.jpg",
    imageAlt: "NotesAid landing page with the Start Learning Now button",
    githubUrl: "https://github.com/yashankkothari/Notes-Aid",
    tags: ["Next.js", "React", "TypeScript", "PWA", "Open Source"],
    metrics: [
      { icon: "users", label: "2,700+ unique users" },
      { icon: "chart", label: "17,000+ views" },
    ],
    year: 2025,
    status: "shipped",
    category: "Open source",
    order: 3,
    enabled: true,
  },
  {
    id: "malnotware",
    title: "MalNotWare — Hybrid malware detector",
    description:
      "A browser extension that watches what you download, then watches what it does.",
    content:
      "## Problem\nMost people download a file and open it without a second thought. Signature-based antivirus catches known threats, but new or modified malware can slip past a hash lookup.\n\n## What I built\nMalNotWare combines two kinds of analysis and starts them automatically when a file is downloaded.\n- **Static analysis:** a custom browser extension catches the download and checks it against the **VirusTotal API** for known threats.\n- **Dynamic analysis:** suspicious files are executed inside an isolated **Docker** sandbox, where their behavior is monitored in real time.\n- **Containment:** the container isolates the file from the host, so running something dangerous only risks a disposable container.\n\n## Results\nThe result is a working hybrid detector. It flags known malware immediately and gives unknown files a second look based on what they actually do, not just what they look like.",
    image: "/img/projects/malnotware-home.jpg",
    imageAlt: "MalNotWare landing page: Detect Threats with Hybrid AI",
    githubUrl: "https://github.com/yashankkothari/Malnotware-Malware-Detection-with-AI-ML",
    tags: ["Docker", "VirusTotal API", "Browser Extension", "JavaScript"],
    metrics: [
      { icon: "chart", label: "Two analysis layers" },
      { icon: "users", label: "Real-time behavior monitoring" },
    ],
    year: 2025,
    status: "shipped",
    category: "Security",
    order: 4,
    enabled: true,
  },
  {
    id: "oncolytix",
    title: "OncoLytix — Lung CT screening app",
    description:
      "A phone app that reads lung CT scans and returns a prediction in seconds.",
    content:
      "## Problem\nReading CT scans takes trained specialists and time. I wanted to see how far a lightweight model on a mobile-friendly stack could go as a first-pass screening aid. It was built as a learning project, not a diagnostic tool.\n\n## What I built\n- **Model:** a MobileNetV2-based image classifier trained with MediaPipe Model Maker on lung CT images. MobileNetV2 is small enough to serve quickly without a heavy GPU.\n- **API:** a Flask REST service that handles image preprocessing, queues requests, and returns predictions in real time.\n- **App:** a cross-platform React Native (Expo) front end where a user uploads a scan and sees the result clearly.\n\n## Results\nThe classifier reached 87% accuracy on held-out CT scans, and the full loop runs end to end: upload, preprocessing, prediction, display.",
    image: "/img/projects/oncolytix-home.jpg",
    imageAlt: "OncoLytix app home screen on a phone: Lung Cancer Detection",
    githubUrl: "https://github.com/yashankkothari/Lung-Cancer-Detection-Using-ML",
    tags: ["MobileNetV2", "MediaPipe", "React Native", "Expo", "Flask"],
    metrics: [
      { icon: "chart", label: "87% accuracy" },
      { icon: "users", label: "iOS and Android" },
    ],
    year: 2025,
    status: "shipped",
    category: "Applied ML",
    order: 5,
    enabled: true,
  },
  {
    id: "truehire",
    title: "TrueHire — Résumé credibility checker",
    description:
      "An LLM desktop app that checks a candidate's résumé against their GitHub and scores how credible it is.",
    content:
      "## Problem\nRecruiters see inflated résumés, borrowed projects and timelines that don't line up, and real background checks are slow and expensive. We wanted a first pass that takes seconds.\n\n## What I built\nBuilt with a teammate for a hackathon.\n- **Inputs:** a résumé (PDF, DOC, DOCX or TXT), a LinkedIn export and a GitHub username.\n- **AI pipeline:** files are parsed and normalised, then sent to Google Gemini with prompts that ask it to check every claim against public GitHub activity.\n- **Output:** a structured credibility score with its reasoning, plus red flags such as suspicious projects, unsupported claims and timeline gaps.\n- **App:** an Electron desktop UI (Lit components) that streams Gemini's analysis to the recruiter as it arrives.\n\n## What I learned\nMost of the work was prompt design: getting the model to cite the evidence for each claim and return a fixed structure the UI can render, instead of a confident paragraph.",
    image: "/img/projects/truehire-home.jpg",
    imageAlt: "TrueHire: résumé, LinkedIn and GitHub in, Gemini credibility score out",
    githubUrl: "https://github.com/yashankkothari/TruHire",
    tags: ["Google Gemini", "Prompt Engineering", "Electron", "Lit"],
    metrics: [
      { icon: "chart", label: "3 sources cross-checked" },
      { icon: "users", label: "Streaming results" },
    ],
    year: 2025,
    status: "shipped",
    category: "Applied ML",
    order: 6,
    enabled: true,
  },
  {
    id: "aadhaar-redesign",
    title: "Aadhaar Portal Redesign — Accessible prototype",
    description:
      "An accessible, multilingual prototype of the UIDAI Aadhaar portal for people the current one leaves behind.",
    content:
      "## Problem\nThe Aadhaar portal is something every Indian needs, but it's hard to use for elderly citizens, rural and low-literacy users, people with visual impairments and anyone who doesn't read English comfortably.\n\n## What I built\n- **Language first:** the prototype opens on a language picker, in English, Hindi, Tamil, Telugu, Bengali and Marathi.\n- **Accessibility:** adjustable text size, a high-contrast mode, keyboard navigation, 44px touch targets and alt text throughout, aiming for WCAG 2.1 AA.\n- **Voice:** hover-to-speak text-to-speech, so people can hear the interface instead of reading it.\n- **Services:** step-by-step mock flows for downloading Aadhaar, updating details, booking an appointment, verifying a number, generating a Virtual ID and locking biometrics, with progress saved in local storage.",
    image: "/img/projects/aadhaar-home.jpg",
    imageAlt: "Accessible Aadhaar portal prototype",
    liveUrl:
      "https://raw.githack.com/yashankkothari/Aadhar-Folder/master/index.html",
    githubUrl: "https://github.com/yashankkothari/Aadhar-Folder",
    tags: ["React", "JavaScript", "WCAG 2.1", "Web Speech API", "Accessibility"],
    metrics: [
      { icon: "users", label: "6 languages, with voice help" },
      { icon: "chart", label: "WCAG 2.1 AA target" },
    ],
    year: 2025,
    status: "shipped",
    category: "Accessibility",
    order: 7,
    enabled: true,
  },
];
