import type { ComponentType } from "react";
import { PaperCutIcon, PrintDots, type ComponentIconProps } from "./paper-cut-icons";

function HomeIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={-6} silhouette="M9 29 31 10 54 29 49 29 49 51 15 51 15 29Z">
      <path d="m9 29 22-19 23 19-6 2-17-14-16 14Z" fill="var(--cutout-accent)" />
      <path d="M27 51V35h10v16" fill="var(--cutout-paper)" />
      <path d="M41 32h4v7h-4Z" fill="currentColor" strokeWidth="1.5" />
      <PrintDots x={17} y={38} />
    </PaperCutIcon>
  );
}

function FolderIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} accent="var(--chart-1)" silhouette="M9 21V14Q9 11 14 11H25L31 17H48Q52 17 52 22V27H55L49 49Q48 52 43 52H14Q9 52 9 47Z">
      <path d="M18 27V18H39L45 24V28" fill="var(--cutout-paper)" strokeWidth="2.5" />
      <path d="M39 18v7h6M25 24h7" strokeWidth="2" />
      <path d="M10 46 16 28H55L49 49Q48 52 43 52H14Q10 52 10 46Z" fill="var(--cutout-wash)" />
      <path d="M22 35h12" />
      <PrintDots x={34} y={40} />
    </PaperCutIcon>
  );
}

function DocumentIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={5} silhouette="M16 8H39L50 20V55Q50 57 47 57H16Q13 57 13 54V11Q13 8 16 8Z">
      <path d="M39 8v13h11" strokeWidth="2.5" />
      <path d="M21 27h18M21 34h18M21 41h12" strokeWidth="2.5" />
      <path d="M21 20h9" strokeWidth="2.5" />
      <PrintDots x={40} y={44} />
    </PaperCutIcon>
  );
}

function PencilIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon
      {...props}
      accent="var(--chart-1)"
      tilt={-8}
      silhouette="M45 9 55 19 22 52 9 55 12 42Z"
    >
      <path d="M45 9 55 19 49 25 39 15Z" fill="var(--cutout-accent)" />
      <path d="M39 15 49 25 22 52 9 55 12 42Z" fill="var(--cutout-paper)" />
      <path d="M18 36 28 46M12 42l3 3" strokeWidth="2" />
      <PrintDots x={30} y={32} />
    </PaperCutIcon>
  );
}

function ClockIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon
      {...props}
      tilt={-6}
      silhouette="M32 6a26 26 0 1 1 0 52 26 26 0 1 1 0-52Z"
    >
      <circle cx="32" cy="32" r="18" fill="var(--cutout-paper)" strokeWidth="2" />
      <path d="M32 20v12l8 6" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="2.5" fill="var(--cutout-accent)" stroke="none" />
      <PrintDots x={20} y={44} />
    </PaperCutIcon>
  );
}

function DeskIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon
      {...props}
      accent="var(--chart-2)"
      tilt={-5}
      silhouette="M8 44h48l-4 8H12Z"
    >
      <rect x="16" y="20" width="30" height="20" rx="2" fill="var(--cutout-paper)" strokeWidth="2" />
      <path d="M28 40v4M22 44h14" strokeWidth="2.5" />
      <path d="M21 26h8M21 31h14M21 36h10" strokeWidth="1.8" />
      <PrintDots x={12} y={16} />
    </PaperCutIcon>
  );
}

const navIcons: Record<string, ComponentType<ComponentIconProps>> = {
  home: HomeIcon,
  work: FolderIcon,
  blog: PencilIcon,
  now: ClockIcon,
  uses: DeskIcon,
  resume: DocumentIcon,
  folder: FolderIcon,
  stack: FolderIcon,
};

export function getNavIcon(name: string) {
  return navIcons[name] ?? DocumentIcon;
}
