import type { ProfileBannerSticker } from "@/config/types";

export const profileBannerConfig = {
  label: "A few things from my desk",
  profileLabel: "Animate my profile sticker",
  profileSoundSrc: "/profile-pop.mp3",
};

export const profileBannerStickers: ProfileBannerSticker[] = [
  {
    id: "notebook",
    src: "/images/profile-stickers/database.webp",
    alt: "A paper-cut database cylinder with blue rings",
    label: "Animate the database sticker",
    tilt: -7,
    order: 1,
    soundSrc: "/notebook-page-turn.mp3",
  },
  {
    id: "keyboard",
    src: "/images/profile-stickers/terminal.webp",
    alt: "A dark terminal window running an Airflow command",
    label: "Animate the terminal sticker",
    tilt: 4,
    order: 2,
    soundSrc: "/keyboard-click.mp3",
  },
  {
    id: "plane",
    src: "/images/profile-stickers/chart.webp",
    alt: "A paper-cut bar chart with a rising trend line",
    label: "Animate the chart sticker",
    tilt: -9,
    order: 3,
    soundSrc: "/plane-whoosh.mp3",
  },
  {
    id: "coffee",
    src: "/images/profile-stickers/coffee.webp",
    alt: "A halftone coffee cup with warm steam",
    label: "Animate the coffee sticker",
    tilt: 7,
    order: 4,
    soundSrc: "/coffee-cup.mp3",
  },
];
