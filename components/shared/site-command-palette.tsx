"use client";

import {
  Contrast,
  BookmarkCheckIcon,
  FolderOpen,
  Home,
  Link,
  Monitor,
  Moon,
  Sun,
} from "@/components/shared/site-icons";
import { FaGithub } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useMemo } from "react";

import {
  CommandPalette,
  type CommandPaletteGroup,
  type CommandPaletteItem,
  type CommandPalettePage,
} from "@/components/ui/command-palette";
import { bookshelfConfig } from "@/config/books";
import { projectsConfig } from "@/config/projects";
import { siteConfig } from "@/config/site";
import { playCopySound } from "@/lib/copy-sound";

/**
 * The site-wide command palette, mounted once in the header. Every route is a
 * couple of keystrokes away: top-level pages, each case study, plus theme
 * controls and quick actions.
 */
export function SiteCommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { setTheme } = useTheme();

  const groups = useMemo<CommandPaletteGroup[]>(() => {
    const go = (href: string) => () => router.push(href);

    const projectItems: CommandPaletteItem[] = projectsConfig.map((project) => ({
      id: `project-${project.id}`,
      label: project.title,
      icon: <FolderOpen className="size-4" />,
      keywords: ["project", "case study", project.category, project.id],
      onSelect: go(`/project/${project.id}`),
    }));

    return [
      {
        label: "Navigate",
        items: [
          {
            id: "go-home",
            label: "Home",
            icon: <Home className="size-4" />,
            keywords: ["landing", "start", "top"],
            onSelect: go("/"),
          },
          {
            id: "go-portfolio",
            label: "All projects",
            icon: <FolderOpen className="size-4" />,
            keywords: ["work", "portfolio", "projects"],
            onSelect: go("/portfolio"),
          },
          {
            id: "go-blog",
            label: "Writing",
            icon: <FolderOpen className="size-4" />,
            keywords: ["blog", "posts", "articles", "notes"],
            onSelect: go("/blog"),
          },
          {
            id: "go-now",
            label: "Now",
            icon: <FolderOpen className="size-4" />,
            keywords: ["now", "currently", "reading", "listening", "playing"],
            onSelect: go("/now"),
          },
          {
            id: "go-uses",
            label: "Uses",
            icon: <FolderOpen className="size-4" />,
            keywords: ["uses", "setup", "hardware", "desk", "tools", "gear"],
            onSelect: go("/uses"),
          },
          {
            id: "go-resume",
            label: "Resume",
            icon: <FolderOpen className="size-4" />,
            keywords: ["experience", "cv", "work history"],
            onSelect: go("/resume"),
          },
          {
            id: "go-bookshelf",
            label: bookshelfConfig.title,
            icon: <BookmarkCheckIcon className="size-4" />,
            keywords: ["books", "reading", "library", "shelf"],
            onSelect: go(bookshelfConfig.href),
          },
        ],
      },
      { label: "Projects", items: projectItems },
      {
        label: "Actions",
        items: [
          {
            id: "open-github",
            label: "Open GitHub",
            icon: <FaGithub className="size-4" />,
            badge: "external",
            keywords: ["profile", "repos", "code"],
            onSelect: () =>
              window.open(
                `https://github.com/${siteConfig.personal.githubUsername}`,
                "_blank",
              ),
          },
          {
            id: "copy-url",
            label: "Copy site URL",
            icon: <Link className="size-4" />,
            keywords: ["link", "share", "address", "copy"],
            onSelect: () => {
              navigator.clipboard
                ?.writeText(siteConfig.meta.url)
                .then(() => playCopySound())
                .catch(() => {});
            },
          },
          {
            id: "change-theme",
            label: "Change theme…",
            icon: <Contrast className="size-4" />,
            keywords: ["dark", "light", "system", "appearance", "mode"],
            page: "theme",
          },
        ],
      },
    ];
  }, [router]);

  const pages = useMemo<CommandPalettePage[]>(
    () => [
      {
        id: "theme",
        label: "Theme",
        placeholder: "Search themes…",
        items: [
          {
            id: "theme-light",
            label: "Light",
            icon: <Sun className="size-4" />,
            onSelect: () => setTheme("light"),
          },
          {
            id: "theme-dark",
            label: "Dark",
            icon: <Moon className="size-4" />,
            onSelect: () => setTheme("dark"),
          },
          {
            id: "theme-system",
            label: "System",
            icon: <Monitor className="size-4" />,
            onSelect: () => setTheme("system"),
          },
        ],
      },
    ],
    [setTheme],
  );

  return (
    <CommandPalette
      groups={groups}
      pages={pages}
      open={open}
      onOpenChange={onOpenChange}
      recents
      disableOnMobile
      hotkey={false}
    />
  );
}
