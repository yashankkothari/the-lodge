module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "src/_includes/monogram.njk": "img/monogram.svg" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/files": "files" });
  eleventyConfig.addPassthroughCopy({ "src/audio": "audio" });

  eleventyConfig.addFilter("readableDate", (date) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  // Tags that group content internally and should not show up as topics.
  const HIDDEN_TAGS = ["all", "post", "project"];
  eleventyConfig.addFilter("topicTags", (tags) => (tags || []).filter((t) => !HIDDEN_TAGS.includes(t)));
  eleventyConfig.addCollection("topics", (api) => {
    const set = new Set();
    api.getFilteredByTag("post").forEach((p) => (p.data.tags || []).forEach((t) => set.add(t)));
    return [...set].filter((t) => !HIDDEN_TAGS.includes(t)).sort();
  });

  // cache-busting token so phones never keep a stale stylesheet
  eleventyConfig.addGlobalData("assetV", Date.now().toString(36));

  // minimal design helpers
  const topic = (tags) => { tags = tags || []; return tags.includes("essays") ? "essays" : tags.includes("backend") ? "backend" : tags.includes("agents") ? "agents" : (tags.includes("linux") && !tags.includes("genai")) ? "linux" : tags.includes("data-engineering") ? "data" : "genai"; };
  eleventyConfig.addFilter("topic", topic);
  eleventyConfig.addFilter("byTopic", (posts, t) => posts.filter((p) => topic(p.data.tags) === t));
  const M = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  eleventyConfig.addFilter("monthYear", (d) => { d = new Date(d); return M[d.getUTCMonth()] + " " + d.getUTCFullYear(); });
  eleventyConfig.addFilter("dayNum", (d) => String(new Date(d).getUTCDate()).padStart(2, "0"));
  eleventyConfig.addFilter("shortDate", (d) => { d = new Date(d); return M[d.getUTCMonth()] + " " + String(d.getUTCDate()).padStart(2, "0"); });


  const plainText = (html) => String(html || "").replace(/<[^>]*>/g, " ").replace(/&(?:nbsp|amp|quot|#39|lt|gt);/g, " ").replace(/\s+/g, " ").trim();
  const headingEntries = (html) => {
    const counts = new Map();
    return [...String(html || "").matchAll(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g)].map((m) => {
      const text = plainText(m[3]);
      const base = (text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-") || "section");
      const count = counts.get(base) || 0;
      counts.set(base, count + 1);
      const existing = m[2].match(/\bid=["']([^"']+)["']/);
      return { level: Number(m[1]), text, id: existing ? existing[1] : base + (count ? "-" + count : "") };
    });
  };
  const xmlEscape = (s) => String(s == null ? "" : s).replace(/[<>&"']/g, (c) => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;", '"':"&quot;", "'":"&apos;" }[c]));
  eleventyConfig.addFilter("xmlEscape", xmlEscape);
  eleventyConfig.addFilter("readingTime", (html) => Math.max(1, Math.ceil(plainText(html).split(/\s+/).length / 220)));
  eleventyConfig.addFilter("excerpt", (html) => plainText(html).slice(0, 240));
  eleventyConfig.addFilter("year", (date) => new Date(date).getUTCFullYear());
  eleventyConfig.addFilter("isoDate", (date) => new Date(date).toISOString());
  eleventyConfig.addFilter("rssDate", (date) => new Date(date).toUTCString());
  eleventyConfig.addFilter("articleHeadings", headingEntries);
  eleventyConfig.addFilter("headingLinks", (html) => {
    const entries = headingEntries(html);
    let index = 0;
    return String(html || "").replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g, (full, level, attrs, text) => {
      const heading = entries[index++];
      const idAttr = /\bid=/.test(attrs) ? "" : ' id="' + xmlEscape(heading.id) + '"';
      return "<h" + level + attrs + idAttr + ">" + text + '<a class="heading-anchor" href="#' + xmlEscape(heading.id) + '" aria-label="Link to ' + xmlEscape(heading.text) + '">#</a></h' + level + ">";
    });
  });
  eleventyConfig.addFilter("relatedPosts", (posts, url, tags) => {
    const topics = (tags || []).filter((tag) => !HIDDEN_TAGS.includes(tag) && tag !== "guides");
    return posts.filter((post) => post.url !== url).map((post) => ({ post, score: (topic(post.data.tags) === topic(tags) ? 4 : 0) + (post.data.tags || []).filter((tag) => topics.includes(tag)).length })).filter((entry) => entry.score > 0).sort((a,b) => b.score - a.score || b.post.date - a.post.date).slice(0,3).map((entry) => entry.post);
  });
  eleventyConfig.addGlobalData("buildYear", new Date().getUTCFullYear());

  return {
    dir: { input: "src", output: "_site", includes: "_includes" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
