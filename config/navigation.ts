import type { SiteNavigationItem } from "@/config/types";

export const navigationConfig = {
  label: "Site navigation",
  mobileLabel: "Mobile navigation",
  menu: "Menu",
  close: "Close navigation",
  search: "Open command palette",
  backToTop: "Back to top",
  githubLabel: "View source on GitHub (opens in a new tab)",
};

export const navigationItems: SiteNavigationItem[] = [
  { id: "home", label: "Home", href: "/", icon: "home", order: 0 },
  { id: "work", label: "Projects", href: "/portfolio", icon: "work", order: 1 },
  { id: "experience", label: "Experience", href: "/resume", icon: "resume", order: 2 },
  { id: "blog", label: "Writing", href: "/blog", icon: "blog", order: 3 },
  { id: "now", label: "Now", href: "/now", icon: "now", order: 4 },
  { id: "uses", label: "Uses", href: "/uses", icon: "uses", order: 5 },
];
