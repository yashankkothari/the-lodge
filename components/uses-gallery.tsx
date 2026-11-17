"use client";

import { useState } from "react";
import { getUsesArt } from "@/components/landing/uses-art";
import { usesConfig, usesGroups } from "@/config/uses";
import { cn } from "@/lib/utils";

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
          const Art = getUsesArt(item.art);
          return (
            <li key={item.id} className="min-w-0 text-center">
              <div className="flex h-36 items-center justify-center text-muted-foreground sm:h-44">
                {Art && <Art size={116} className="size-28 sm:size-32" />}
              </div>
              <h2 className="text-sm font-medium leading-snug tracking-tight">{item.name}</h2>
              {item.note && <p className="mx-auto mt-2 max-w-52 text-xs leading-relaxed text-muted-foreground">{item.note}</p>}
              <p className="mt-2 font-mono text-[10px] tracking-wide text-muted-foreground/60">{item.categoryTitle}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

