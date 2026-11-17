"use client";

import { profileBannerConfig } from "@/config/profile-banner";
import { DitherPhoto } from "./dither-photo";
import styles from "./profile-banner.module.css";

export function ProfileBanner() {
  return (
    <div className="relative pt-10">
      <figure className={styles.composition} aria-label={profileBannerConfig.label}>
        <DitherPhoto />
        <figcaption className={styles.credit}>
          <a href={profileBannerConfig.photo.sourceUrl} target="_blank" rel="noopener noreferrer">
            {profileBannerConfig.photo.credit}
          </a>
        </figcaption>
      </figure>
    </div>
  );
}
