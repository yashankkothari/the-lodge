import type { SocialLink } from "@/config/types";

export const socialSectionConfig = {
  title: "Socials",
};

export const socialsConfig: SocialLink[] = [
  {
    id: "github",
    platform: "GitHub",
    handle: "@yashankkothari",
    href: "https://github.com/yashankkothari",
    icon: "github",
    action: "external",
    order: 1,
    enabled: true,
  },
  {
    id: "linkedin",
    platform: "LinkedIn",
    handle: "in/yashankkothari",
    href: "https://www.linkedin.com/in/yashankkothari/",
    icon: "linkedin",
    action: "external",
    tooltipDefault: "Connect on LinkedIn",
    order: 2,
    enabled: true,
  },
  {
    id: "rss",
    platform: "RSS",
    handle: "/feed.xml",
    href: "/feed.xml",
    icon: "rss",
    action: "external",
    tooltipDefault: "Subscribe to the feed",
    order: 3,
    enabled: true,
  },
  {
    id: "email",
    platform: "Email",
    handle: "kothariyashank@gmail.com",
    href: "mailto:kothariyashank@gmail.com",
    icon: "gmail",
    action: "mailto",
    tooltipDefault: "Send email",
    order: 4,
    enabled: true,
  },
];
