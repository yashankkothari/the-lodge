"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteNavigationItems, isNavigationItemActive } from "@/components/shared/site-navigation";
import { HeaderGlass } from "@/components/shared/header-glass";
import { navigationConfig } from "@/config/navigation";
import { motion, useReducedMotion } from "motion/react";
import styles from "./bottom-nav.module.css";

export function BottomNav() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  return (
    <nav aria-label={navigationConfig.mobileLabel} className={styles.nav}>
      <HeaderGlass className={styles.surface} />
      {siteNavigationItems.map((item) => {
        const active = isNavigationItemActive(item, pathname) || (item.id === "work" && pathname.startsWith("/project/"));
        return (
          <Link key={item.id} href={item.href} aria-current={active ? "page" : undefined} className={styles.link} data-active={active}>
            {active && <motion.span aria-hidden="true" className={styles.active} layoutId="phone-navigation-active" transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 430, damping: 34 }} />}
            <item.Icon aria-hidden="true" className={styles.icon} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
