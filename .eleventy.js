module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
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

  // minimal design helpers
  const topic = (tags) => { tags = tags || []; return tags.includes("agents") ? "agents" : (tags.includes("linux") && !tags.includes("genai")) ? "linux" : tags.includes("data-engineering") ? "data" : "genai"; };
  eleventyConfig.addFilter("topic", topic);
  eleventyConfig.addFilter("byTopic", (posts, t) => posts.filter((p) => topic(p.data.tags) === t));
  const M = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  eleventyConfig.addFilter("monthYear", (d) => { d = new Date(d); return M[d.getUTCMonth()] + " " + d.getUTCFullYear(); });
  eleventyConfig.addFilter("dayNum", (d) => String(new Date(d).getUTCDate()).padStart(2, "0"));
  eleventyConfig.addFilter("shortDate", (d) => { d = new Date(d); return M[d.getUTCMonth()] + " " + String(d.getUTCDate()).padStart(2, "0"); });

  return {
    dir: { input: "src", output: "_site", includes: "_includes" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
