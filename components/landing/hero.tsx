"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { VerseText } from "@/components/verse-text";
import { heroConfig, heroContactLinks } from "@/config/hero";
import { ListTodo, Message } from "@/components/shared/site-icons";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { MOTION_EASE } from "@/lib/motion";
import { RotatingGlobe } from "./rotating-globe";
import { motion, type Variants } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useHaptic } from "react-haptic";
import { profileBannerConfig } from "@/config/profile-banner";
import { InteractiveSticker } from "./interactive-sticker";
import bannerStyles from "./profile-banner.module.css";

const contactIcons = {
  github: FaGithub,
  linkedin: FaLinkedin,
  email: Message,
  resume: ListTodo,
};

// Keep blur on the text itself, so the banner and section shell stay sharp.
const textVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(3px)",
    y: 8,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: MOTION_EASE,
      delay,
      opacity: { duration: 0.28, ease: MOTION_EASE, delay },
    },
  }),
};

const locationTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: siteConfig.personal.location.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export function Hero() {
  const { vibrate } = useHaptic();
  const vibrateAudio = useRef<HTMLAudioElement>(null);
  const lastWaveTrackRef = useRef<number>(0);
  const [isLocationHovered, setIsLocationHovered] = useState(false);
  const [isLocationTooltipOpen, setIsLocationTooltipOpen] = useState(false);
  const [locationTime, setLocationTime] = useState<string | null>(null);

  const handleWaveAudio = (play: boolean, interactionType: "hover" | "touch" = "hover") => {
    const audio = vibrateAudio.current;
    if (!audio) {
      return;
    }

    if (play) {
      const now = Date.now();
      if (now - lastWaveTrackRef.current > 5000) {
        trackEvent("hero_wave_hovered", { interaction_type: interactionType });
        lastWaveTrackRef.current = now;
      }
      audio.currentTime = 0;
      audio.playbackRate = 1;
      audio.volume = 0.6;
      audio.play().catch(() => {});
      return;
    }

    audio.pause();
    audio.currentTime = 0;
  };

  useEffect(() => {
    if (!isLocationTooltipOpen) return;

    const updateLocationTime = () => {
      setLocationTime(locationTimeFormatter.format(new Date()));
    };

    updateLocationTime();
    const intervalId = window.setInterval(updateLocationTime, 1000);

    return () => window.clearInterval(intervalId);
  }, [isLocationTooltipOpen]);

  useEffect(() => {
    const vibrate = vibrateAudio.current;

    return () => {
      vibrate?.pause();
    };
  }, []);

  return (
    <motion.section
      className="relative z-20 space-y-4 px-4 pt-4 sm:px-6"
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 sm:flex sm:items-start sm:gap-5">
        <div className={bannerStyles.profile}>
          <InteractiveSticker src={siteConfig.personal.avatar.src} alt={siteConfig.personal.avatar.alt} label={profileBannerConfig.profileLabel} tilt={-5} sizes="(max-width: 640px) 56px, 88px" soundSrc={profileBannerConfig.profileSoundSrc} />
        </div>
        <div className="contents sm:block sm:w-full sm:min-w-0 sm:space-y-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="flex min-w-0 items-center gap-1 text-xl  font-mono font-semibold tracking-wide sm:text-2xl">
            <VerseText
              text={heroConfig.greeting}
              className="font-serif"
              style={
                {
                  "--vt-ink": "var(--hero-name-ink)",
                  "--vt-blend": "var(--verse-text-blend, multiply)",
                  "--vt-leading": "inherit",
                } as CSSProperties
              }
            />
            <motion.span
              data-reveal=""
              variants={textVariants}
              className="no-js-visible inline-block"
            >
              <span
                aria-hidden="true"
                className="inline-block text-base text-primary/70 motion-safe:hover:animate-wave"
                onMouseEnter={() => {
                  vibrate();
                  handleWaveAudio(true, "hover");
                }}
                onMouseLeave={() => handleWaveAudio(false)}
                onFocus={() => handleWaveAudio(true, "hover")}
                onBlur={() => handleWaveAudio(false)}
                onTouchStart={() => handleWaveAudio(true, "touch")}
                onTouchEnd={() => handleWaveAudio(false)}
                style={{ transformOrigin: "70% 70%" }}
              >
                {typeof heroConfig.waveEmoji === "string" ? (
                  heroConfig.waveEmoji
                ) : (
                  <heroConfig.waveEmoji className="fill-current" />
                )}
              </span>
            </motion.span>
            </div>
            <Tooltip onOpenChange={setIsLocationTooltipOpen}>
              <TooltipTrigger
                className="micro-transition flex min-h-4 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm text-xs text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 hover:text-foreground sm:text-sm"
                onMouseEnter={() => setIsLocationHovered(true)}
                onMouseLeave={() => setIsLocationHovered(false)}
                onFocus={() => setIsLocationHovered(true)}
                onBlur={() => setIsLocationHovered(false)}
              >

                <RotatingGlobe isHovered={isLocationHovered} />
                <motion.span
                  data-reveal=""
                  className="no-js-visible inline-block font-sans"
                  variants={textVariants}
                  custom={0.26}
                >
                  {siteConfig.personal.location.label}
                </motion.span>
              </TooltipTrigger>
              <TooltipContent>
                <span className="font-sans text-xs tracking-wider">
                  {locationTime ?? "--:--:--"}
                </span>
              </TooltipContent>
            </Tooltip>
          </div>

          <motion.h1
            data-reveal=""
            className="no-js-visible col-span-full text-base font-medium leading-snug tracking-tight text-balance"
            variants={textVariants}
            custom={0.1}
          >
            {heroConfig.headline}
          </motion.h1>

          <motion.p
            data-reveal=""
            className="no-js-visible col-span-full text-sm text-muted-foreground sm:mt-2"
            variants={textVariants}
            custom={0.18}
          >
            {heroConfig.description}
          </motion.p>

          <div className="col-span-full flex flex-wrap gap-x-1 sm:gap-x-2">
            {heroContactLinks.map(({ icon, label, href }) => {
              const Icon = contactIcons[icon];
              return (
                <Link
                  key={icon}
                  href={href}
                  className="micro-transition inline-flex min-h-11 items-center gap-1 rounded-sm px-0.5 text-xs text-muted-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-ring sm:gap-1.5 sm:px-1"
                >
                  <Icon size={14} aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <audio src="/vibration.mp3" ref={vibrateAudio} loop preload="none" />
    </motion.section>
  );
}
