// Pulls profile + public repos from the GitHub API at build time.
// Falls back to the last successful snapshot if the network or rate limit fails.
const fs = require("fs");
const path = require("path");

const USER = "yashankkothari";
const CACHE = path.join(__dirname, "github-cache.json");
// Repos to leave off the site (profile README repo, forks are skipped automatically).
const HIDDEN = new Set([USER, "yashankkothari.github.io"]);

async function getJSON(url) {
  const headers = { "User-Agent": "eleventy-portfolio" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

module.exports = async function () {
  // rebuilds during development reuse a fresh snapshot instead of burning the 60/hour API limit
  if (fs.existsSync(CACHE) && Date.now() - fs.statSync(CACHE).mtimeMs < 3600000) {
    const cached = JSON.parse(fs.readFileSync(CACHE, "utf8"));
    if (cached.languages) return cached;
  }
  try {
    const [profile, repos] = await Promise.all([
      getJSON(`https://api.github.com/users/${USER}`),
      getJSON(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`),
    ]);
    const own = repos.filter((r) => !r.fork && !HIDDEN.has(r.name));
    const perRepo = await Promise.all(own.map((r) => getJSON(r.languages_url).catch(() => ({}))));
    const totals = {};
    perRepo.forEach((langs) => Object.entries(langs).forEach(([k, v]) => (totals[k] = (totals[k] || 0) + v)));
    const sum = Object.values(totals).reduce((a, b) => a + b, 0) || 1;
    const top = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const max = top.length ? top[0][1] : 1;
    const languages = top.map(([name, bytes]) => {
      const pct = (bytes / sum) * 100;
      const width = Math.max(1, Math.round((bytes / max) * 30));
      return { name, label: name.slice(0, 12).padEnd(12), bytes, pct: pct.toFixed(1), bar: "█".repeat(width) + "░".repeat(30 - width), repos: perRepo.filter((l) => l[name]).length };
    });
    const data = {
      languages,
      totalBytes: sum,
      stars: own.reduce((a, r) => a + r.stargazers_count, 0),
      firstYear: Math.min(...own.map((r) => new Date(r.created_at).getUTCFullYear())),
      lastPush: own.map((r) => r.pushed_at).sort().pop() || null,
      name: profile.name,
      bio: profile.bio,
      location: profile.location,
      avatar: profile.avatar_url,
      url: profile.html_url,
      publicRepos: profile.public_repos,
      followers: profile.followers,
      repos: repos
        .filter((r) => !r.fork && !r.archived && !HIDDEN.has(r.name))
        .map((r) => ({
          name: r.name.replace(/[-_]/g, " "),
          description: r.description ? r.description.trim() : null,
          language: r.language,
          stars: r.stargazers_count,
          url: r.html_url,
          homepage: r.homepage || null,
          year: new Date(r.created_at).getUTCFullYear(),
          pushed: r.pushed_at,
        })),
    };
    fs.writeFileSync(CACHE, JSON.stringify(data, null, 2));
    return data;
  } catch (err) {
    console.warn(`[github] fetch failed (${err.message}); using cached snapshot`);
    return fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, "utf8")) : { repos: [] };
  }
};
