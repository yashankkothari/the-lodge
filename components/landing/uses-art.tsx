import type { ComponentType } from "react";
import {
  PaperCutIcon,
  PrintDots,
  type ComponentIconProps,
} from "@/components/shared/paper-cut-icons";

/**
 * Paper-cut illustrations for the /uses page.
 *
 * Same recipe as every other illustration on the site: muted ink outline,
 * paper edge, offset print shadow, halftone dots, and one warm accent. These
 * are drawings of the gear, not product photos, which keeps the page honest
 * and visually part of the rest of the site.
 */

function Monitor(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={-4} silhouette="M8 14h48v30H8Z">
      <rect x="12" y="18" width="40" height="22" fill="var(--cutout-paper)" strokeWidth="1.6" />
      <path d="M20 24h18M20 29h24M20 34h12" strokeWidth="1.6" />
      <path d="M32 44v6M22 50h20" strokeWidth="2.4" />
      <rect x="40" y="20" width="9" height="6" fill="var(--cutout-accent)" stroke="none" opacity="0.6" />
      <PrintDots x={13} y={8} />
    </PaperCutIcon>
  );
}

function Keyboard(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={-3} silhouette="M6 22h52v22H6Z">
      <rect x="10" y="26" width="44" height="14" fill="var(--cutout-paper)" strokeWidth="1.5" />
      <g fill="currentColor" stroke="none" opacity="0.55">
        <rect x="13" y="29" width="4" height="3.4" rx="0.8" />
        <rect x="19" y="29" width="4" height="3.4" rx="0.8" />
        <rect x="25" y="29" width="4" height="3.4" rx="0.8" />
        <rect x="31" y="29" width="4" height="3.4" rx="0.8" />
        <rect x="37" y="29" width="4" height="3.4" rx="0.8" />
        <rect x="43" y="29" width="8" height="3.4" rx="0.8" />
        <rect x="13" y="34" width="6" height="3" rx="0.8" />
        <rect x="21" y="34" width="18" height="3" rx="0.8" />
        <rect x="41" y="34" width="10" height="3" rx="0.8" />
      </g>
      <rect x="33" y="28.5" width="4" height="4.2" rx="1" fill="var(--cutout-accent)" stroke="none" />
      <PrintDots x={48} y={12} />
    </PaperCutIcon>
  );
}

function Mouse(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={6} silhouette="M32 12c11 0 17 9 17 22s-6 22-17 22-17-9-17-22 6-22 17-22Z">
      <path d="M32 14v16" strokeWidth="2" />
      <path d="M15 32h34" strokeWidth="1.8" opacity="0.6" />
      <rect x="30" y="20" width="4" height="8" rx="2" fill="var(--cutout-accent)" stroke="none" />
      <ellipse cx="32" cy="42" rx="9" ry="6" fill="currentColor" stroke="none" opacity="0.12" />
      <PrintDots x={18} y={18} />
    </PaperCutIcon>
  );
}

function Headphones(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={-5} silhouette="M12 44V32a20 20 0 0 1 40 0v12h-9V32a11 11 0 0 0-22 0v12Z">
      <rect x="8" y="34" width="10" height="17" rx="4" fill="var(--cutout-accent)" strokeWidth="2" />
      <rect x="46" y="34" width="10" height="17" rx="4" fill="var(--cutout-accent)" strokeWidth="2" />
      <path d="M32 12v-4M22 15l-2-3M42 15l2-3" strokeWidth="2" />
      <PrintDots x={28} y={38} />
    </PaperCutIcon>
  );
}

function Microphone(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={4} silhouette="M32 8c7 0 11 5 11 12v10c0 7-4 12-11 12s-11-5-11-12V20c0-7 4-12 11-12Z">
      <path d="M17 30a15 15 0 0 0 30 0" strokeWidth="2.4" />
      <path d="M32 45v10M24 56h16" strokeWidth="2.6" />
      <g stroke="currentColor" strokeWidth="1.4" opacity="0.5">
        <path d="M26 18h12M26 24h12M26 30h12" />
      </g>
      <circle cx="32" cy="16" r="2.6" fill="var(--cutout-accent)" stroke="none" />
    </PaperCutIcon>
  );
}

function Speaker(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={-6} silhouette="M18 10h28v44H18Z">
      <circle cx="32" cy="26" r="9" fill="var(--cutout-paper)" strokeWidth="2" />
      <circle cx="32" cy="26" r="3.4" fill="var(--cutout-accent)" stroke="none" />
      <circle cx="32" cy="44" r="5" fill="var(--cutout-paper)" strokeWidth="1.8" />
      <path d="M23 14h18" strokeWidth="1.8" opacity="0.5" />
      <PrintDots x={22} y={32} />
    </PaperCutIcon>
  );
}

function Tablet(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={5} silhouette="M12 12h40v40H12Z">
      <rect x="16" y="16" width="32" height="32" fill="var(--cutout-paper)" strokeWidth="1.6" />
      <rect x="20" y="20" width="24" height="16" fill="var(--cutout-accent)" stroke="none" opacity="0.35" />
      <path d="M20 42h16M20 46h10" strokeWidth="1.5" />
      <circle cx="32" cy="49" r="1.4" fill="currentColor" stroke="none" />
    </PaperCutIcon>
  );
}

function Tower(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={-4} silhouette="M16 6h32v52H16Z">
      <rect x="21" y="12" width="22" height="16" fill="var(--cutout-paper)" strokeWidth="1.8" />
      <g stroke="currentColor" strokeWidth="1.4" opacity="0.55">
        <path d="M25 17h14M25 21h10M25 25h16" />
      </g>
      <circle cx="32" cy="36" r="7" fill="none" strokeWidth="2" />
      <circle cx="32" cy="36" r="2.4" fill="var(--cutout-accent)" stroke="none" />
      <path d="M24 48h16" strokeWidth="2" opacity="0.5" />
      <PrintDots x={40} y={44} />
    </PaperCutIcon>
  );
}

function TerminalWindow(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={-3} silhouette="M8 14h48v38H8Z">
      <rect x="8" y="14" width="48" height="12" fill="var(--cutout-accent)" stroke="none" opacity="0.45" />
      <g fill="currentColor" stroke="none" opacity="0.6">
        <circle cx="14" cy="20" r="1.8" />
        <circle cx="20" cy="20" r="1.8" />
        <circle cx="26" cy="20" r="1.8" />
      </g>
      <g fill="currentColor" stroke="none" opacity="0.7">
        <rect x="14" y="32" width="12" height="2.4" rx="1" />
        <rect x="14" y="38" width="22" height="2.4" rx="1" />
        <rect x="14" y="44" width="8" height="2.4" rx="1" />
        <rect x="25" y="44" width="3" height="2.4" rx="1" fill="var(--cutout-accent)" />
      </g>
      <PrintDots x={44} y={36} />
    </PaperCutIcon>
  );
}

function Chip(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={-4} silhouette="M20 20h24v24H20Z">
      <rect x="26" y="26" width="12" height="12" fill="var(--cutout-accent)" stroke="none" opacity="0.6" />
      <g stroke="currentColor" strokeWidth="2.2">
        <path d="M26 20V12M32 20V12M38 20V12M26 44v8M32 44v8M38 44v8" />
        <path d="M20 26h-8M20 32h-8M20 38h-8M44 26h8M44 32h8M44 38h8" />
      </g>
      <PrintDots x={12} y={12} />
    </PaperCutIcon>
  );
}

function NeuralNet(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} accent="var(--chart-2)" tilt={-5} silhouette="M18 12h28v40H18Z">
      <g stroke="currentColor" strokeWidth="1.5" opacity="0.55" fill="none">
        <path d="M24 20 32 32M24 32 32 32M24 44 32 32M40 20 32 32M40 32 32 32M40 44 32 32M32 32 44 32" />
      </g>
      <g fill="currentColor" stroke="none">
        <circle cx="22" cy="20" r="3" />
        <circle cx="22" cy="32" r="3" />
        <circle cx="22" cy="44" r="3" />
        <circle cx="34" cy="20" r="3" />
        <circle cx="34" cy="44" r="3" />
      </g>
      <circle cx="32" cy="32" r="4.6" fill="var(--cutout-accent)" stroke="none" />
      <circle cx="45" cy="32" r="3.4" fill="currentColor" stroke="none" />
      <PrintDots x={38} y={10} />
    </PaperCutIcon>
  );
}

function Database(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={-5} silhouette="M14 18v28q0 6 18 6t18-6V18Z">
      <ellipse cx="32" cy="18" rx="18" ry="6" fill="var(--cutout-accent)" stroke="none" opacity="0.6" />
      <path d="M14 28q0 6 18 6t18-6M14 38q0 6 18 6t18-6" strokeWidth="2" fill="none" />
      <path d="M18 46 16 55M46 46l2 9" strokeWidth="2" opacity="0.4" />
      <PrintDots x={26} y={22} />
    </PaperCutIcon>
  );
}

function Blocks(props: ComponentIconProps) {
  return (
    <PaperCutIcon {...props} tilt={-6} silhouette="M14 34h16v16H14ZM34 34h16v16H34ZM24 14h16v16H24Z">
      <rect x="14" y="34" width="16" height="16" fill="var(--cutout-paper)" strokeWidth="1.8" />
      <rect x="34" y="34" width="16" height="16" fill="var(--cutout-accent)" stroke="none" opacity="0.5" />
      <rect x="24" y="14" width="16" height="16" fill="var(--cutout-paper)" strokeWidth="1.8" />
      <path d="M32 30v4M22 34l4-4M42 34l-4-4" strokeWidth="1.6" opacity="0.5" />
      <PrintDots x={38} y={20} />
    </PaperCutIcon>
  );
}

export const usesArt: Record<string, ComponentType<ComponentIconProps>> = {
  tower: Tower,
  monitor: Monitor,
  keyboard: Keyboard,
  mouse: Mouse,
  headphones: Headphones,
  microphone: Microphone,
  speaker: Speaker,
  tablet: Tablet,
  terminal: TerminalWindow,
  chip: Chip,
  neural: NeuralNet,
  database: Database,
  blocks: Blocks,
};

export function getUsesArt(id: string) {
  return usesArt[id];
}
