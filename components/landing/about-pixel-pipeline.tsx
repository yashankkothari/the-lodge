"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import styles from "./about-pixel-pipeline.module.css";

const terminal = [
  ".#################.",
  "#HHHHHHHHHHHHHHHHH#",
  "#HSSSSSSSSSSSSSSSD#",
  "#HS.G.........G.SD#",
  "#HS..G..........SD#",
  "#HS.G.GGG.......SD#",
  "#HS.............SD#",
  "#HS..DD.DDDD....SD#",
  "#HSSSSSSSSSSSSSSSD#",
  "#DDDDDDDAAADDDDDDD#",
  ".#################.",
  "......#DDDDD#......",
  "....############...",
];

const server = [
  ".#############.",
  "#HHHHHHHHHHHHH#",
  "#HSSSSSSSSSSSD#",
  "#HSGSDSDDSASSD#",
  "#HSSSSSSSSSSSD#",
  "#DDDDDDDDDDDDD#",
  "#HSSSSSSSSSSSD#",
  "#HSGSDSDDSASSD#",
  "#HSSSSSSSSSSSD#",
  "#DDDDDDDDDDDDD#",
  ".#############.",
  "..##.......##..",
  "..##.......##..",
];

const colors: Record<string, string> = {
  "#": "var(--pixel-ink)",
  H: "var(--pixel-highlight)",
  S: "var(--pixel-screen)",
  D: "var(--pixel-blue)",
  G: "var(--success)",
  A: "var(--pixel-amber)",
};

function spriteStyle(rows: string[]): CSSProperties {
  const pixels = rows.flatMap((row, y) =>
    Array.from(row).flatMap((pixel, x) =>
      pixel === "." ? [] : [`${x * 3}px ${y * 3}px ${colors[pixel]}`],
    ),
  );

  return { boxShadow: pixels.join(", ") };
}

const terminalStyle = spriteStyle(terminal);
const serverStyle = spriteStyle(server);

export function AboutPixelPipeline() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        scene.dataset.active = "";
        observer.disconnect();
      }
    });
    observer.observe(scene);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sceneRef} className={styles.scene} aria-hidden="true">
      <div className={styles.track}>
        <span className={styles.packet} />
        <span className={styles.packet} />
        <span className={styles.packet} />
      </div>
      <span className={styles.terminal} style={terminalStyle} />
      <span className={styles.server} style={serverStyle} />
      <span className={styles.cursor} />
      <span className={styles.indicator} />
    </div>
  );
}
