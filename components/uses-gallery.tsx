"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { usesConfig, usesGroups } from "@/config/uses";
import { usesImages } from "@/config/uses-images";
import { cn } from "@/lib/utils";
import styles from "./uses-gallery.module.css";

const entries = usesGroups.flatMap((group) => [
  ...group.items.map((item) => ({ ...item, category: group.id, categoryTitle: group.title })),
  ...(group.plain ?? []).map((item) => ({
    id: `${group.id}-${item.label}`,
    name: item.label,
    note: item.value,
    art: group.art ?? "blocks",
    category: group.id,
    categoryTitle: group.title,
  })),
]);

export function UsesGallery() {
  const stickerId = useId().replaceAll(":", "");
  const [category, setCategory] = useState("all");
  const selectedGroup = usesGroups.find((group) => group.id === category);
  const visible = category === "all" ? entries : entries.filter((item) => item.category === category);
  const filters = [
    { id: "all", label: usesConfig.allLabel, count: entries.length },
    ...usesGroups.map((group) => ({
      id: group.id,
      label: group.filterLabel ?? group.title,
      count: entries.filter((item) => item.category === group.id).length,
    })),
  ];

  return (
    <div className="px-6 sm:px-8">
      <svg className={styles.filters} aria-hidden="true" focusable="false">
        <defs>
          <filter id={stickerId} x="-25%" y="-25%" width="150%" height="160%" colorInterpolationFilters="sRGB">
            <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="edge" />
            <feFlood floodColor="var(--sticker-paper)" result="paper" />
            <feComposite in="paper" in2="edge" operator="in" result="outline" />
            <feDropShadow in="outline" dx="1" dy="3" stdDeviation="2" floodColor="var(--sticker-shadow)" floodOpacity="0.18" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <div role="group" aria-label={usesConfig.filterLabel} className="flex flex-wrap gap-x-5 gap-y-1 border-t border-border py-3">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            aria-pressed={category === filter.id}
            aria-controls="uses-inventory"
            onClick={() => setCategory(filter.id)}
            className={cn(
              "micro-transition relative inline-flex min-h-11 items-center gap-1.5 font-mono text-[11px] tracking-wide outline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
              category === filter.id ? "text-primary after:absolute after:inset-x-0 after:bottom-1 after:h-px after:bg-primary" : "text-muted-foreground",
            )}
          >
            {filter.label}
            <span className="text-[9px] opacity-60">{filter.count}</span>
          </button>
        ))}
      </div>
      {selectedGroup?.body && (
        <p className="max-w-xl pt-5 text-sm leading-relaxed text-muted-foreground">{selectedGroup.body}</p>
      )}
      <p role="status" className="sr-only">{visible.length} items, {selectedGroup?.title ?? usesConfig.allLabel}</p>
      <ul id="uses-inventory" aria-label={selectedGroup?.title ?? usesConfig.title} className="grid grid-cols-2 gap-x-5 gap-y-10 pb-14 pt-6 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-12">
        {visible.map((item) => {
          const media = usesImages[item.id];
          return (
            <li key={item.id} className={cn(styles.item, "min-w-0 text-center")}>
              <a href={media.href} target="_blank" rel="noopener noreferrer" className={cn(styles.link, "block rounded-lg outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring")}>
                <div className={styles.artwork} aria-hidden="true">
                  {media.files.map((file) => (
                    <div key={file} className={cn(styles.sticker, media.files.length > 1 && styles.pair, file.endsWith(".svg") && styles.logo)} style={{ filter: `url(#${stickerId})` }}>
                      <Image src={`/images/uses/${file}`} alt="" width={240} height={240} sizes="(max-width: 639px) 140px, 180px" className={styles.image} style={media.clip ? { clipPath: media.clip, height: "auto", aspectRatio: "1" } : undefined} />
                    </div>
                  ))}
                </div>
                <h2 className="text-sm font-medium leading-snug tracking-tight">{item.name}</h2>
                <span className="sr-only">{usesConfig.externalLinkLabel}</span>
              </a>
              {item.note && <p className="mx-auto mt-2 max-w-52 text-xs leading-relaxed text-muted-foreground">{item.note}</p>}
              <p className="mt-2 font-mono text-[10px] tracking-wide text-muted-foreground/60">{item.categoryTitle}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

