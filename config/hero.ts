import type { HeroConfig } from "@/config/types";
import { MdWavingHand } from "react-icons/md";

export const heroConfig: HeroConfig = {
  greeting: "Yashank Kothari",
  waveEmoji: MdWavingHand,
  headlineBefore: "I build",
  highlightedPhrases: ["data pipelines", "production"],
  headlineAfter: ".",
  description:
    "Data engineer in Mumbai. I work on ETL pipelines, reporting workflows, reconciliation, and applied AI/ML. Outside work, I build software like Savory and Pixonomy.",
  descriptionHighlight: "build software",
};
