/**
 * Snapshots the public GitHub contribution calendar into
 * `config/github-contributions.json`.
 *
 * GitHub's GraphQL API needs a token; the public profile page does not. This
 * reads the same numbers the profile page shows, so the chart renders on a
 * fresh clone or a deploy without secrets. Run it when you want fresher data:
 *
 *   npm run sync:contributions
 *
 * The app treats the JSON as a fallback: when GITHUB_TOKEN is set, live
 * GraphQL data wins and this file is only used if that call fails.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";

const USER = process.env.GITHUB_USERNAME ?? "yashankkothari";
const OUT = path.join(process.cwd(), "config/github-contributions.json");
const URL = `https://github.com/users/${USER}/contributions`;

const response = await fetch(URL, { headers: { "User-Agent": "portfolio" } });
if (!response.ok) {
  throw new Error(`GitHub returned ${response.status} for ${URL}`);
}
const html = await response.text();

/** Cells carry the date and the level; tooltips carry the exact count. */
const cells = new Map();
for (const match of html.matchAll(/<td\b[^>]*>/g)) {
  const tag = match[0];
  const date = tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
  const id = tag.match(/id="([^"]+)"/)?.[1];
  const level = tag.match(/data-level="(\d)"/)?.[1];
  if (date && id) cells.set(id, { date, level: Number(level) });
}

const tips = new Map();
for (const match of html.matchAll(
  /<tool-tip\b[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g,
)) {
  tips.set(
    match[1],
    match[2]
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

const days = [];
for (const [id, cell] of cells) {
  const text = tips.get(id);
  if (text === undefined) continue;

  let count;
  if (/^No contributions/i.test(text)) {
    count = 0;
  } else {
    const digits = text.match(/^([\d,]+)\s+contributions?/i)?.[1];
    if (digits === undefined) continue;
    count = Number(digits.replace(/,/g, ""));
  }

  if (!Number.isSafeInteger(count) || count < 0) continue;
  days.push({ date: cell.date, count, level: cell.level });
}

if (days.length === 0) {
  throw new Error("No contribution days parsed; the page markup may have changed.");
}

days.sort((a, b) => a.date.localeCompare(b.date));

const snapshot = {
  username: USER,
  source: URL,
  syncedAt: new Date().toISOString(),
  total: days.reduce((sum, day) => sum + day.count, 0),
  days: days.map((day) => ({ date: day.date, count: day.count, level: day.level })),
};

writeFileSync(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);

console.log(
  `Wrote ${days.length} days (${snapshot.total} contributions) to ${path.relative(process.cwd(), OUT)}`,
);
console.log(`Range ${days[0].date} to ${days[days.length - 1].date}`);
