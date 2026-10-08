// GitHub contribution calendar for the minimal homepage, read from the public profile page at build time.
// Falls back to the last snapshot; returns [] if nothing is available (the graph section then hides).
const fs = require("fs");
const path = require("path");
const CACHE = path.join(__dirname, "contributions-cache.json");
module.exports = async function () {
  try {
    const res = await fetch("https://github.com/users/yashankkothari/contributions", { headers: { "User-Agent": "eleventy-portfolio" } });
    if (!res.ok) throw new Error(res.status);
    const html = await res.text();
    const days = [];
    const re = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*?data-level="(\d)"|data-level="(\d)"[^>]*?data-date="(\d{4}-\d{2}-\d{2})"/g;
    let m;
    while ((m = re.exec(html))) days.push({ date: m[1] || m[4], level: +(m[2] || m[3]) });
    if (!days.length) throw new Error("no days");
    days.sort((a, b) => a.date.localeCompare(b.date));
    const total = (html.match(/([\d,]+)\s+contributions?\s+in the last year/) || [])[1] || "";
    const out = { days, total };
    fs.writeFileSync(CACHE, JSON.stringify(out));
    return out;
  } catch (e) {
    if (fs.existsSync(CACHE)) return JSON.parse(fs.readFileSync(CACHE, "utf8"));
    return { days: [], total: "" };
  }
};
