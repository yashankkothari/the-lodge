"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { nowMediaConfig } from "@/config/now";
import { cn } from "@/lib/utils";
import styles from "./media-object.module.css";

/** Adapted from Commonplace's MediaObject, using local artwork and portfolio tokens. */
export function MediaObject({ item, medium }: { item: { title: string; image: string }; medium: "book" | "music" | "game" }) {
  const [open, setOpen] = useState(false);
  return (
    <button type="button" className={styles.pickup} aria-label={`${open ? nowMediaConfig.putBackLabel : nowMediaConfig.inspectLabel} ${item.title}`} aria-pressed={open} onClick={() => setOpen((value) => !value)} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}>
      <span className={cn(styles.object, styles[medium], open && styles.open)}>
        {medium === "book" ? <span className={styles.pages} aria-hidden="true" /> : <span className={styles.disc} aria-hidden="true" style={medium === "music" ? { "--art": `url("${item.image}")` } as CSSProperties : undefined}><i /></span>}
        <span className={styles.case}>
          {medium === "game" && <span className={styles.band} aria-hidden="true">{nowMediaConfig.gamePlatform}</span>}
          <span className={cn(styles.cover, medium === "music" && styles.square)}>
            <Image src={item.image} alt="" fill quality={90} sizes="(max-width: 639px) 240px, 300px" className="object-cover" />
          </span>
        </span>
      </span>
    </button>
  );
}
