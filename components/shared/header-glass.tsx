"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./site-header.module.css";

/** A rounded lens normal map: flat at the center, refractive around its curved rim. */
function makeLens(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const context = canvas.getContext("2d");
  if (!context) return null;
  const image = context.createImageData(canvas.width, canvas.height);
  const halfWidth = canvas.width / 2;
  const halfHeight = canvas.height / 2;
  const radius = halfHeight;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const px = x + 0.5 - halfWidth;
      const py = y + 0.5 - halfHeight;
      const qx = Math.abs(px) - (halfWidth - radius);
      const qy = Math.abs(py) - (halfHeight - radius);
      const ox = Math.max(qx, 0);
      const oy = Math.max(qy, 0);
      const length = Math.hypot(ox, oy);
      const distance = length + Math.min(Math.max(qx, qy), 0) - radius;
      const depth = Math.max(0, -distance);
      const bend = Math.exp(-Math.pow(depth / (radius * 0.55), 2)) * 0.44;
      const nx = length > 0 ? (ox / length) * Math.sign(px) : 0;
      const ny = length > 0 ? (oy / length) * Math.sign(py) : Math.sign(py);
      const i = (y * canvas.width + x) * 4;
      image.data[i] = Math.round((0.5 - nx * bend) * 255);
      image.data[i + 1] = Math.round((0.5 - ny * bend) * 255);
      image.data[i + 2] = 128;
      image.data[i + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return canvas.toDataURL("image/png");
}

export function HeaderGlass({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = `header-lens-${useId().replaceAll(":", "")}`;
  const [lens, setLens] = useState<{ src: string; width: number; height: number } | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !CSS.supports("backdrop-filter", `url(#${id})`)) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const src = makeLens(width, height);
      if (src) setLens({ src, width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [id]);

  return (
    <>
      <svg aria-hidden="true" focusable="false" className="absolute size-0 pointer-events-none">
        <defs>
          <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            {lens && <feImage href={lens.src} width="100%" height="100%" preserveAspectRatio="none" result="lens" />}
            <feDisplacementMap in="SourceGraphic" in2="lens" scale="10" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <div ref={ref} className={`${styles.glass} ${className}`} data-refractive={lens ? "true" : undefined} style={lens ? { backdropFilter: `url(#${id}) blur(3px) saturate(1.45)`, WebkitBackdropFilter: `url(#${id}) blur(3px) saturate(1.45)` } : undefined} aria-hidden="true" />
    </>
  );
}
