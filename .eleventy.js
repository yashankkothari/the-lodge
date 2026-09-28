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

  return {
    dir: { input: "src", output: "_site", includes: "_includes" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
