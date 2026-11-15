import type { SiteNavigationItem } from "@/config/types";

export const navigationConfig = {
  label: "Site navigation",
  menu: "Menu",
  close: "Close navigation",
  search: "Open command palette",
  backToTop: "Back to top",
  githubLabel: "View source on GitHub (opens in a new tab)",
};

export const navigationItems: SiteNavigationItem[] = [
  { id: "home", label: "Home", href: "/", icon: "home", order: 0 },
  { id: "work", label: "Work", href: "/portfolio", icon: "work", order: 1 },
  { id: "blog", label: "Writing", href: "/blog", icon: "blog", order: 2 },
  { id: "now", label: "Now", href: "/now", icon: "now", order: 3 },
  { id: "uses", label: "Uses", href: "/uses", icon: "uses", order: 4 },
];
