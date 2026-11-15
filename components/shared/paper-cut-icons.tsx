import type { CSSProperties, ReactNode, SVGProps } from "react";
import { cn } from "@/lib/utils";

export interface ComponentIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export interface PaperCutIconProps extends ComponentIconProps {
  silhouette: string;
  accent?: string;
  tilt?: number;
  children: ReactNode;
}

/**
 * The shared paper-cut base: muted ink outline, paper edge, offset print
 * shadow, and a restrained accent wash. Every illustration on the site is
 * built from this one recipe.
 */
export function PaperCutIcon({
  size = 64,
  color = "currentColor",
  accent = "var(--primary)",
  silhouette,
  tilt = -7,
  children,
  style,
  className,
  ...props
}: PaperCutIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      color={color}
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn(
        "[--cutout-paper:var(--background)] dark:[--cutout-paper:var(--foreground)] dark:[--cutout-ink:var(--background)]",
        className,
      )}
      style={{
        "--cutout-accent": accent,
        "--cutout-wash": `color-mix(in oklch, ${accent} 18%, var(--cutout-paper))`,
        ...style,
      } as CSSProperties}
      {...props}
    >
      <g
        transform={`rotate(${tilt} 32 32)`}
        color="var(--cutout-ink, currentColor)"
        stroke="currentColor"
      >
        <path
          d={silhouette}
          transform="translate(1 2)"
          fill="var(--foreground)"
          stroke="var(--foreground)"
          strokeWidth="10"
          opacity="0.1"
        />
        <path
          d={silhouette}
          fill="var(--cutout-paper)"
          stroke="var(--cutout-paper)"
          strokeWidth="9"
        />
        <path d={silhouette} fill="var(--cutout-wash)" />
        {children}
      </g>
    </svg>
  );
}

export function PrintDots({ x, y }: { x: number; y: number }) {
  // Explicit keys: these circles are mapped children of a fragment, and React
  // warns without them.
  const dots = [
    [0, 0],
    [4, 0],
    [8, 0],
    [2, 3.5],
    [6, 3.5],
    [0, 7],
    [4, 7],
    [8, 7],
  ];

  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="currentColor"
      stroke="none"
      opacity="0.35"
    >
      {dots.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.8" />
      ))}
    </g>
  );
}

/** Paper-cut database cylinder, used by the About heading mascots and Discord icons. */
export function DatabaseIcon(props: ComponentIconProps) {
  return (
    <PaperCutIcon
      {...props}
      tilt={-6}
      silhouette="M12 16v32q0 6 20 6t20-6V16Z"
    >
      <ellipse cx="32" cy="16" rx="20" ry="6" fill="var(--cutout-accent)" />
      <path d="M12 28q0 6 20 6t20-6M12 40q0 6 20 6t20-6" />
      <PrintDots x={26} y={19} />
    </PaperCutIcon>
  );
}
