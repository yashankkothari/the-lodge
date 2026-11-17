"use client";

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { experienceTerms } from "@/config/experience-terms";
import { cn } from "@/lib/utils";
import styles from "./experience-text.module.css";

const terms = new Map<string, (typeof experienceTerms)[number]>(experienceTerms.map((item) => [item.term, item]));
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pattern = new RegExp(`(?<![\\w])(${[...terms.keys()].sort((a, b) => b.length - a.length).map(escape).join("|")})(?![\\w])`, "g");

function Term({ item }: { item: (typeof experienceTerms)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button type="button" onClick={() => setOpen(true)} className={cn(styles.term, "outcome" in item && styles.outcome)}>
          {item.term}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={7} className="max-w-64 text-pretty leading-relaxed motion-reduce:animate-none" hideArrow>
        {item.detail}
      </TooltipContent>
    </Tooltip>
  );
}

export function ExperienceText({ children }: { children: string }) {
  return (
    <TooltipProvider delayDuration={180}>
      {children.split(pattern).map((part, index) => {
        const term = terms.get(part);
        return term ? <Term key={`${index}-${part}`} item={term} /> : part;
      })}
    </TooltipProvider>
  );
}
