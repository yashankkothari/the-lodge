import type { HeroConfig } from "@/config/types";
import { MdWavingHand } from "react-icons/md";
import { socialsConfig } from "./socials";

export const heroConfig: HeroConfig = {
  greeting: "Yashank Kothari",
  waveEmoji: MdWavingHand,
  headline: "I build data pipelines in production.",
  description:
    "My day job is reporting and reconciliation. On the side, I build Savory and Pixonomy.",
};

export const heroContactLinks = [
  ...(["github", "linkedin", "email"] as const).flatMap((icon) => {
    const social = socialsConfig.find(({ id, enabled }) => id === icon && enabled !== false);
    return social?.href ? [{ icon, label: social.platform, href: social.href }] : [];
  }),
  { icon: "resume", label: "Resume", href: "/resume" },
] as const;
