"use client";

import { HeaderActions } from "@/components/shared/header-actions";
import { Logo } from "@/components/shared/logo";
import { siteNavigationItems, isNavigationItemActive } from "@/components/shared/site-navigation";
import { navigationConfig } from "@/config/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { revealOnMount } from "@/lib/motion";
import styles from "./site-header.module.css";
import { HeaderGlass } from "./header-glass";

export function SiteHeader() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  return (
    <header className={cn(styles.header, "pointer-events-none sticky top-2 z-40 mx-auto -mb-11 flex h-11 w-full max-w-[var(--frame-max-w)] items-center justify-between gap-4 px-6")}>
      <HeaderGlass />
      <motion.nav
        {...revealOnMount({ y: -10 })}
        aria-label={navigationConfig.label}
        className="pointer-events-auto flex items-center gap-2"
      >
        <Link
          href="/"
          aria-label="Home"
          aria-current={pathname === "/" ? "page" : undefined}
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            styles.homeLink,
          )}
        >
          <span aria-hidden="true" className={styles.logoStage}>
            <Logo size={34} />
          </span>
        </Link>

        <div className="hidden items-center gap-0.5 md:flex">

          {siteNavigationItems.filter((item) => item.id !== "home").map((item) => {
            const active = isNavigationItemActive(item, pathname);
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={active ? "location" : undefined}
                data-active={active}
                className={cn(styles.tab, item.id === "components" && styles.accent)}
              >
                {active && <motion.span aria-hidden="true" className={styles.activeTab} layoutId="desktop-navigation-active" transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 430, damping: 34 }} />}
                <span aria-hidden="true" className={styles.navIcon}><item.Icon /></span>
                <span className={styles.label}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </motion.nav>
      <HeaderActions />
    </header>
  );
}
