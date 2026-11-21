# agents.md

> Standing context for this repo. Read it before the first edit, and update it in
> the same commit whenever a convention changes.

## 1. House rules

Five rules sit above everything else.

1. **UI copy uses sentence case.** Capitalize the first letter of labels,
   buttons, headings, and empty states. Avoid `ALL-CAPS` shouting. Do not
   force strings to lowercase. Scope and exceptions in [§10 UI copy](#10-ui-copy).
2. **No em dashes.** Never use the em dash character (the long dash) in UI copy or documentation. Rewrite with a comma, colon, or period instead.
3. **One border per edge.** Never put a border on top of a border that already
   exists. See [§9 Borders](#9-borders).
4. **Scoped edits.** Change what was asked for. Unrelated files stay untouched,
   including work already sitting dirty in the tree.
5. **Ask before pushing.** At the end of every run, once the work is complete
   and verified, use the AskUserQuestion tool to ask whether to push the
   changes to GitHub. Only commit and push when the answer is yes. Never push
   without asking first.

Working style: finish the task, then report the result in a few lines. No
preamble, no recaps, no process commentary. When a detail is missing, take the
reasonable default, note the assumption, and keep moving.

## 2. What this is

A portfolio for Yashank Kothari (yashank.site): data engineering work, side
projects, and one case study per project. No backend, no database, no auth, no
payments. All content is typed configuration.

- Production: https://yashank.site
- Deploy: Vercel

The layout, motion system, and component design come from
[Aditya Ojha's portfolio](https://github.com/AdityaKodez/adityaojha) under the
MIT License, and `LICENSE` carries that notice. Content, artwork, and case
studies are original.

## 3. Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16, App Router, React Server Components, Turbopack |
| UI | React 19 |
| Language | TypeScript 5, strict |
| Styling | Tailwind 4 via `@tailwindcss/postcss`, plus `@tailwindcss/typography` and `tw-animate-css` |
| Primitives | Radix UI and Base UI, vendored into `components/ui/`; Vaul for mobile drawers |
| Motion | Motion 12 |
| Icons | HugeIcons for site controls via `components/shared/site-icons.tsx`; `lucide-react` in shared UI; `react-icons` for brand marks |
| Fonts | DM Sans (body), Geist Mono, and Instrument Serif; OG TTFs in `lib/fonts/` |
| Theming | `next-themes`, class-based dark mode |
| Dates | `date-fns` 4 with `date-fns-tz` |
| Markdown | `react-markdown` for case studies, with Shiki highlighting |
| Tooling | ESLint 9 via `eslint-config-next` |
| Analytics | Vercel Analytics and Speed Insights, plus optional PostHog |

## 4. Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run lint` | ESLint across the repo |
| `npm run build` | Production build |
| `npm run start` | Serves the production build |

There is no typecheck script; run `npx tsc --noEmit` directly.

## 5. Directory map

| Path | Contents |
| --- | --- |
| `app/` | Routes: `page.tsx` (home), `portfolio/`, `resume/`, `project/[id]/` (case studies), and `api/discord-status/`; plus `layout.tsx`, `error.tsx`, `globals.css`, `robots.ts`, `sitemap.ts`, `manifest.ts`, `opengraph-image.tsx`, `not-found.tsx` |
| `components/landing/` | One file per home section: hero, about, skills, projects, bookshelf, footer, and so on |
| `components/shared/` | Header, theme provider, site icons, the paper-cut base, the command palette, `copy-status-icon.tsx` |
| `components/ui/` | Vendored shadcn and Radix primitives |
| `components/motion-primitives/` | Motion-heavy building blocks |
| `components/skeletons/` | Loading placeholders |
| `config/` | The data layer, one file per domain, plus `types.ts` |
| `lib/` | `utils.ts` (the `cn` helper), `github/` (data and activity), `markdown/`, `discord-status.ts`, `motion.ts`, `analytics.ts`, `visitor-count.ts`, `fonts/` |
| `public/images/` | Artwork: desk stickers, book covers and spines, the footer garden, the OG garden |
| `public/img/` | Site assets: project screenshots, company logos, book reference photos, the resume PDF |
| `plans/` | Private planning docs, gitignored |

Removed from the upstream repo and not to be reintroduced: the shadcn component
registry (`/components` routes, `registry.json`, `scripts/build-registry.mjs`,
`public/r/`), the `/testimonials` page, the sponsor and Dodo payment routes, and
the component suggestion API. Those depended on Aditya's data and accounts.

## 6. Data layer: the database

There is no runtime database and no server-side persistence. The "database" is
the typed config layer in `config/`: plain TypeScript objects, checked by the
compiler, imported directly by the components that need them. `config/` is the
single source of truth for content, change content there, never inline in a
component.

| File | Holds |
| --- | --- |
| `config/types.ts` | Every shared type, plus the `SectionId` union |
| `config/site.ts` | The root `siteConfig`: meta, personal info, section order and flags, banner, about, services, workflow, contact, bookmarks, certifications |
| `config/hero.ts` | `heroConfig`, hero copy |
| `config/books.ts` | Bookshelf copy and ordered books, local covers, source URLs, and spine presentation |
| `config/skills.ts` | `skillsSectionConfig` + `skillsConfig` |
| `config/socials.ts` | `socialSectionConfig` + `socialsConfig` |
| `config/projects.ts` | `projectsSectionConfig` + `projectsConfig` |
| `config/section-notes.ts` | Optional handwritten side-note copy and left/right placement, keyed by home section |
| `config/experience.ts` | `experienceSectionConfig` + `experienceConfig` |
| `config/resume.ts` | Resume page content: roles, leadership, education, certifications, skill groups |
| `config/navigation.ts` | Header and menu destinations |
| `config/profile-banner.ts` | Desk sticker artwork, labels, and sounds |
| `config/diwali.ts` | Seasonal decoration, disabled by default |
| `config/not-found.ts` | 404 copy |
| `config/opengraph.ts` | OG image palette, location, artwork |
| `config/visitor-count.ts` | Footer visitor baseline snapshot |
| `config/world-cities.ts` | City coordinates used by the dotted world map |

Pattern to copy: every domain exports a section config object (heading text) and
a typed item array. Every item carries `id`, `order`, and an optional `enabled`
flag.

## 7. Schema

All types live in `config/types.ts`.

- **`SiteMetaConfig`**: `url`, `title`, `titleTemplate`, `shortTitle`,
  `description`, `keywords`, `authors`, `creator`, `publisher`,
  `classification`, `category`, `locale`, `ogImage`, `twitterCreator`, `icon`,
  `appleIcon`, `googleVerification`, `manifest`, `robots`, `sitemap`.
- **`PersonalInfo`**: `fullName`, `firstName`, `avatar` (`src`, `alt`,
  `fallback`), `location` (`label`, `timeZone`), `githubUsername`.
- **`HeroConfig`**: `greeting`, `waveEmoji`, `headline`, and `description`.
  The hero's GitHub, LinkedIn, and email links reuse `socialsConfig`.
- **`AboutConfig`**: fallback `title` and plain-text `body`. `config/site.ts`
  also exports `aboutGreetings` and typed `aboutItems` for the illustrated
  introduction. `body` is derived from those items so the text stays in sync.
- **`SkillItem`**: `id`, `name`, `icon` (a `SkillIcon` key), `category`
  (`language`, `data`, `backend`, `frontend`, `tools`), `order`, `enabled`.
- **`SocialLink`**: `id`, `platform`, `handle`, `href`, `icon`, `order`,
  `enabled`, `action` (`copy`, `external`, `mailto`), `copyValue`,
  `shortcutKey`, `tooltipDefault`.
- **`Project`**: `id`, `title`, `description`, `content`, `image`, `imageAlt`,
  `liveUrl`, `githubUrl`, `year`, `status` (`building`, `new`, `shipped`),
  `category`, `tags`, `metrics` (icon `users` or `chart`, plus `label`),
  `order`, `enabled`. The explorer splits `title` on " — " into a name and a
  subtitle, so keep that separator.
- **`ExperienceItem`**: `id`, `role`, `company`, `period`, `summary`,
  `highlights`, `order`, `enabled`.
- **`Book`**: `id`, `title`, `author`, `cover`, `sourceUrl`, `coverSourceUrl`,
  `spine`, `order`, `enabled`.
- **`Bookmark` / `Certification`**: `id`, `url`, `title`, `domain`, `date`
  (certifications only), `icon`.
- **`ContactConfig`**: `title`, `description`, `pricing` (label, value, note),
  `channels` (reuses `SocialLink`).
- **`PortfolioConfig`**: `meta`, `personal`, `sectionOrder`, `sectionFlags`,
  `bookmarks`, `certifications`, `banner`, `about`, `services`, `workflow`,
  `contact`.

## 8. Sections and flags

The home page is a loop, not a hand-written layout.

- `app/page.tsx` maps over `siteConfig.sectionOrder` and skips any id whose
  `sectionFlags` entry is false, so reordering or hiding a section is a config
  change only.
- Every non-GitHub section has an entry in the `staticSections` map in
  `app/page.tsx`, keyed by `SectionId`.
- `github` is special: it is server-fetched, wrapped in React Suspense with
  `components/skeletons/github-skeleton.tsx`, and only rendered when
  `GITHUB_TOKEN` is present.
- The current order is projects, writing, socials, about, github, experience,
  skills, bookshelf, bookmarks, certifications. Services, workflow and contact exist but
  are flagged off.

To add a section:

1. Add the id to the `SectionId` union in `config/types.ts`.
2. Build the component in `components/landing/`.
3. Register it in `staticSections` in `app/page.tsx`.
4. Add its flag and its position to `siteConfig`.

Collapsible sections use `AccordionSection` in
`components/ui/accordion-section.tsx`, it owns the heading, the expand
animation, and the dashed top rule. Do not hand-roll a second variant.

## 9. Borders

This site is drawn with hairlines, and hairlines compound fast. The rule is
simple: **one border per edge, one mechanism per element.**

- The shell owns the outer frame. `app/layout.tsx` draws the centered column
  (`max-w-[var(--frame-max-w)]`), the muted gutter (`px-2 border-x`),
  FrameGutters, and BottomNav. The bottom fade (one masked backdrop blur plus
  PixelDissolve) stays on `app/page.tsx` only. `<main>` inside the shell
  carries `border-x bg-background`, with `border-b-2` only on routes without
  the shared footer so pages with it can blend into the artwork. Nothing inside
  main re-declares an outer frame or adds a vertical side rule.
- Each section owns exactly one dashed top rule (`border-t border-dashed`). If a
  parent already draws a rule on that edge, the child does not add another.
- `.section-heading` in `app/globals.css` already declares
  `border-y border-dashed`. An element using that class must not also carry
  `border-t` or `border-b`.
- Pick either `ring-1 ring-inset` or `border`, never both on the same element.
  In this codebase cards and pills use `ring-1 ring-inset`; separators use
  `border`.
- Inside `.prose`, blocks already get a radius. Do not wrap them in a second
  bordered and ringed container.
- When a new wrapper is needed, move the border to the outermost element of the
  group instead of adding one per child.
- Divider elements use the `Separator` primitive, which draws its own line. Do
  not add a `border-t` alongside it.

## 10. UI copy

**UI copy uses sentence case.** Capitalize the first letter of labels, buttons,
headings, and empty states. Avoid `ALL-CAPS` shouting. Do not force strings
to lowercase.

```tsx
const EMPTY_STATE = "No activity right now.";
const COPY_LABELS = { idle: "Copy", done: "Copied!" };
```

Guideline:

- tab labels, segmented controls, and collection switchers
- buttons and their state text (`Copy` → `Copied!` → `Copy failed`)
- tooltips, `aria-label`, `alt`, and `title` attributes
- status pills and empty states
- legends (heatmap `Less` / `More`)
- page and section headings rendered from code
- control labels and tooltips that live in `config/` (for example
  `themeTooltip: "Toggle theme"`)

Sentence case is the default. Title Case is fine for proper nouns and product
names. What to avoid is `ALL-CAPS` shouting and forcing every string to
lowercase.

Deliberately **excluded**, leave these as authored:

- **Proper nouns and brand names.** "GitHub", "Discord", "TypeScript",
  "Next.js", "React", "Snowflake", "Oracle", "Airflow", city names, people's
  names.
- **Editorial content in `config/`.** The about body, project copy, bookmark
  titles.
- **SEO and metadata.** `meta.title`, `titleTemplate`, OG image alt text,
  `generateMetadata` output, and the JSON-LD block in `app/layout.tsx`.
- **Keyboard key identifiers.** `"ArrowRight"`, `"Home"`, `"End"`, these are
  DOM `KeyboardEvent.key` values and must match exactly.
- **Console and thrown errors.** Internal diagnostics, not user-facing copy.

## 11. Typography

- Body copy is DM Sans at 14px (`text-sm`). `text-xs` is for meta, and
  `text-base` is the largest size in normal use.
- Headings are `font-medium` with `tracking-tight`. `font-semibold` appears on a
  few section headings only; nothing is heavier than 600 anywhere.
- Mono is Geist Mono, 10-12.5px, for meta labels, keyboard hints, and code.
- Serif accents use `font-serif` (Instrument Serif) and appear sparingly.
- Section headings use the `.section-heading` class rather than ad-hoc sizes.
- Supplemental section notes use `components/shared/side-note.tsx` with Caveat
  handwriting and a decorative curved arrow. Keep their copy in
  `config/section-notes.ts`. They sit in the margins at widths of 80rem and
  above, without adding a border. Hide the entire note, including its arrow,
  below that breakpoint.

## 12. Design system

- Colors come from semantic tokens only: `background`, `foreground`, `card`,
  `popover`, `muted`, `muted-foreground`, `primary`, `secondary`, `accent`,
  `destructive`, `success`, `border`, `input`, `ring`, and `chart-1` through
  `chart-5`. The header's dithered blue logo reuses the `--footer-earth-*`
  palette declared in `app/globals.css`. Never hardcode a hex value in a
  component.
- Radii derive from a single `--radius` (0.45rem) as `sm`, `md`, `lg` and up.
  Use the tokens rather than literal values.
- Dark mode is class-based: `@custom-variant dark (&:is(.dark *))` plus
  `next-themes`, so `dark:` utilities follow the `.dark` class on `<html>`.
- Motion tokens live in `app/globals.css` (`--motion-duration-base`,
  `--motion-ease-standard`). Home page sections, headings, and content rows
  render immediately without scroll entrances. About and Skills stay Server
  Components. About's greeting is a small client component that uses the
  visitor's local time, with a stable server fallback.
- A decorative pixel-art terminal and server sit above the greeting band in
  `components/landing/about-pixel-pipeline.tsx`. Packets travel between them
  once on entry into view. Reduced motion shows the static scene. The About
  section has 56px top padding to clear the artwork.
- Keep interaction motion such as folder expansion and hover previews. The
  GitHub contribution calendar fades in with a subtle scale settle when its
  server-loaded content mounts inside the existing Suspense boundary. The
  calendar pads forward with faint outlined upcoming days to
  `githubSectionConfig.minWeeks` columns so it fills the frame. When it first
  scrolls into view, its dots pop in as a left-to-right wave (scale and opacity
  only); reduced motion, no JavaScript, and a calendar already in view on load
  show it immediately.
- Entrances on other surfaces use the shared reveal helpers in `lib/motion.ts`
  (`reveal`, `revealOnMount`, `revealVariants`): a 0.18s opacity with the ease
  `[0.22, 1, 0.36, 1]` plus a settle spring on `y`. Only `opacity` and
  `transform` are animated, never `filter` (animated blur forces a repaint of
  the whole subtree per frame), and `whileInView` fires once rather than on
  every scroll pass.
- The header logo is a blue dithered version of the hand-lettered yk signature
  on a transparent background, with no tile behind it. It uses the footer
  Earth's four blue shades and an ordered 4 by 4 Bayer pattern, rendered as
  crisp SVG pixels. Hovering the Home link with a fine pointer or focusing it
  with the keyboard lifts the mark by 1px. Reduced motion and touch keep it
  still. Keep the Home link's 44px target intact.
- The profile signature is a transparent, traced SVG of the supplied yk mark
  (`/images/profile-monogram.svg`), configured by `personal.avatar`. It sits
  fully below the banner, beside the name and introduction in a compact row,
  with a positive gap at every breakpoint. Keep its
  background transparent and invert the dark ink in dark mode.
- The full banner is the supplied real photograph of Steve Jobs with a
  Macintosh, credited to Norman Seeff in `config/profile-banner.ts`.
  Light mode uses cobalt ink on off-white paper, including the hero name and
  the banner. `dither-photo.tsx` uses a WebGL ordered Bayer shader with a
  stronger two-tone print in light mode and a softer four-tone grayscale
  treatment in dark mode. Both blend with the source to retain detail. Render only on image load,
  resize, and theme changes, with the original photo as the no-JavaScript,
  unsupported-WebGL, and context-loss fallback. Never replace it with generated
  portrait artwork.
- Important experience technologies and results use `ExperienceText` on the
  home and resume pages. Definitions live in `config/experience-terms.ts`.
  Highlights support hover, keyboard focus, and tap, with reduced-motion-safe
  underline animations and no change to the authored claims.
- The hero name uses the supplied `VerseText` component for its comic print and
  idle glitch, with the foreground and `--verse-text-blend` theme tokens. Keep
  its built-in reduced-motion and offscreen pauses. The headline, description,
  and location reveal once on mount with a 3px blur, an 8px rise, and a 0.5s
  ease-out, with short overlapping delays. Animate only the text, keeping the
  hero shell and banner still. Reduced motion and no JavaScript show the text
  immediately.
- The footer has a slower one-time staggered entrance for its text and live
  status. The Earth reveals independently once it clears the bottom fade, with
  an 80px viewport inset. It follows pointer movement with subtle spring-driven
  parallax, resets on leave, and stays still for touch and reduced motion.
  Animated elements use `data-reveal` for the reduced-motion override, with a
  no-JavaScript fallback.
- The shared header uses text navigation inside one refractive glass capsule.
  Desktop uses the yk logo for Home, with consistently spaced text links and
  one focus target per destination. Small paper-cut icons are integrated beside
  the desktop labels. Search and theme use matching 16px icons on 44px targets
  with transparent faces on desktop and mobile. Do not show an open-source or
  GitHub header button.
  Mobile navigation is a fixed six-destination glass bar in
  `components/landing/bottom-nav.tsx`, with icons, readable labels, safe-area
  spacing, and an animated active pill. Navigation copy and destinations live in
  `config/navigation.ts`. Keep each target at least 44px, the back-to-top control
  above the bar, and enough body padding to clear it. Respect reduced motion.
- The header floats on one refractive glass surface. `header-glass.tsx` creates
  a rounded lens normal map for SVG backdrop displacement and specular inset
  highlights. Avoid RGB separation, which creates edge fringes. Its fallback uses translucent
  blur and saturation; reduced transparency uses an opaque surface. Keep the
  text and controls outside the distortion pass and retain 44px click targets.
- Stack appears after Experience and keeps its technology logos in
  their original colors. On phones, Stack shows six featured tools and links
  to Skills and tools on the Experience page. Home Projects shows only Savory and Pixonomy as visual
  preview cards; the full collection stays on `/portfolio`. The selection and
  previews are configured in `config/projects.ts`.
- Now uses the book, vinyl sleeve, and game-disc treatments adapted from the
  user's Commonplace `MediaObject`. It is separate from the home bookshelf.
  Keep Steve Jobs in Reading, reuse the verified book covers, and use locally
  sourced square album artwork and portrait game artwork. Provenance lives in
  `public/img/now/sources.md`. Support tap and keyboard pickup states and
  reduced motion, with no Commonplace backend or audio-player dependency.
- Shared utility classes: `.section-heading`, `.micro-transition`,
  `.liquid-glass`, `.bottom-blur`, and the blueprint background used on card
  hover. Prefer these over repeating the utility stack.
- `config/diwali.ts` controls the dithered courtyard decoration beside About.
  It is disabled here because the scene under `public/diwali/` is upstream
  artwork. Set `enabled: true` after replacing that folder with your own.
- The 404 page uses a scenery illustration up to 360px wide, clipped to an
  opaque asymmetric torn-paper edge without blur or pixel fading.
- The shared footer on every page stays within the centered page frame, with a
  code-rendered, blue dithered Earth rising from the bottom. Keep its quote and
  credit in `footerConfig` in `config/site.ts`. The Earth turns slowly while
  visible and stays still for reduced motion. The quote, live Discord status,
  and credit sit above it, clear of the fixed bottom controls. The visitor count
  floats centered over the Earth as a liquid-glass pill (`.liquid-glass`, with
  the displacement map rendered by `footer-scene.tsx`).
- Its historical snapshot lives in `config/visitor-count.ts`. Add only the
  increase above the saved lifetime count. Keep the saved total visible when the
  key is missing or the API fails, and reject invalid counts. Update both totals
  together after reconciliation, never sum overlapping history. A fresh site
  sets both to zero, and the counter hides itself rather than painting a 0.
- The footer is a sibling of each page's main, with no opening border or nested
  frame. The Earth stage is 192px tall on mobile and 208px from the small
  breakpoint, with a 720px minimum artwork width. The land coordinates come from
  Natural Earth's public-domain 1:110m land dataset. A small blue satellite
  follows a 32-second tilted orbit above the Earth and disappears behind its far
  side. Its transform and opacity animation shares the Earth's visibility pause
  and holds a visible pose for reduced motion.

### Paper-cut artwork

The Uses page is an exception: use real product photography and authentic
software logos stored in `public/images/uses/`, with provenance in `sources.md`.
Keep the original image colors. `config/uses-images.ts` maps each inventory item
to its assets and product link. Apply the silhouette-following sticker edge and
static shadow in `components/uses-gallery.tsx` and its CSS module, without a
background tile or redrawing the product. Respect reduced motion for hover lifts.

Every illustration uses the `PaperCutIcon` base in
`components/shared/paper-cut-icons.tsx`: muted ink outline, paper edge, offset
  print shadow, halftone dots, and a restrained blue plus one warm accent. The
  same recipe draws the desk stickers, the How I Work icons,
the Discord activity icons, and the project explorer's year folders. Keep the
illustrations free of background tiles.

## 13. Markdown rendering

Case studies render with `react-markdown` on the client, in
`app/project/[id]/project-content.tsx`, using the shared override map from
`lib/markdown/markdown-components.tsx`. Never inline a second set of overrides.

All `.prose` styling lives in one **unlayered** block of `app/globals.css`. It
has to stay unlayered: the typography plugin registers its rules through
`addComponents`, so `.prose` ends up layered and loses to unlayered CSS
regardless of specificity.

Prose colors are mapped onto project tokens (`--foreground`,
`--muted-foreground`, `--primary`, `--border`). That makes `prose-neutral` and
`dark:prose-invert` in markup effectively inert, do not rely on them.

## 14. Bookshelf

- The reusable shelf lives in `components/ui/bookshelf.tsx` with its adjacent
  CSS module. The home section in `components/landing/bookshelf.tsx` supplies
  config copy, the initial book, the section rule, and scroll reveal.
- The bookshelf is a home section directly before Bookmarks, with `/#bookshelf`
  in the command palette and no standalone route. Its data lives in
  `config/books.ts`; artwork lives in `public/images/books/`, with the original
  source URLs in the config.
- The shelf opens `bookshelfConfig.defaultBookId` on first render. Hover lifts
  a closed book gently with a spring, without changing the selected cover.
  Opening a book eases it back onto the shelf; open covers never lift. Click,
  tap, Enter, or Space selects a cover; activating it again, clicking outside,
  or Escape closes it. Focus alone never opens a book. Keep the shelves free
  of drop shadows; disable the lift for touch and reduced motion.
- All books share one continuous row at every width. Narrow screens scroll
  horizontally instead of splitting the collection onto more shelves.
  The mobile ledge spans the full section width and uses the `rounded-lg` radius.
- Covers and spines are real internet-sourced scans or photographs, stored as
  local raster assets with exact source and edition provenance in
  `public/images/books/sources.md` and `config/books.ts`. Keep front covers and
  spines from the same edition, preserving original lettering and proportions.
  Cropping and perspective correction are allowed; do not generate or redraw
  the print. Reveal the flat cover with an opacity transition, not
  perspective rotation, skew, baked-in mockup shadows, or 3D page planes.
- Keep cover images mounted and eagerly loaded before selection. Clip hidden
  artwork inside each book so preloaded covers cannot widen the scroll rail.
- Books reveal once on scroll with the shared reveal helper: a 28px rise,
  60ms stagger, and 120px bottom viewport inset to clear the fixed fade.
  This is a deliberate exception to the immediate home-section rendering rule.
  Keep the reduced-motion and no-JavaScript fallbacks. No title, author, or
  hint caption appears below the shelf; each button retains its accessible label.

## 15. Environment

| Variable | Used by | Behaviour when missing |
| --- | --- | --- |
| `GITHUB_TOKEN` | `lib/github/github.ts`, `app/page.tsx` | The GitHub section is skipped entirely, by design, not a bug |
| `DISCORD_USER_ID` | `app/api/discord-status/route.ts` | Falls back to a hardcoded user id |
| `TALVESS_STATS_KEY` | `lib/visitor-count.ts` | The footer shows the saved historical total without live growth |
| `TALVESS_ORIGIN` | `lib/visitor-count.ts` | Defaults to `https://talvess.app` |
| `NEXT_PUBLIC_POSTHOG_KEY` | `lib/analytics.ts` | Analytics no-ops |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | `config/site.ts` | Skips the meta tag |

Gotchas:

- A dev server is normally already running on http://localhost:3000. Starting a
  second one fails with "Another next dev server is already running", so reuse
  the existing one rather than switching ports.
- `npm install` under `NODE_ENV=production` skips dev dependencies, so
  TypeScript and ESLint are missing and `npx tsc` tries to fetch an unrelated
  `tsc` package. Reinstall with `--include=dev`.
- `var(--font-mono)` does not work in hand-written CSS. `@theme inline` makes
  Tailwind inline the value instead of emitting the variable, so use the
  `font-mono` utility or `var(--font-geist-mono)`.
- `plans/` is gitignored and is not part of the shipped site.

## 16. Definition of done

1. `npx tsc --noEmit`
2. `npm run lint`
3. Check the result in the dev server on http://localhost:3000
4. Update this file if a convention changed

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
