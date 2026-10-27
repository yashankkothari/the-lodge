const fs = require("fs");
const SITE_URL = "https://www.yashank.site";
function rawContent(data) {
  const input = data.page && data.page.inputPath;
  if (!input || !input.endsWith(".md")) return "";
  try { return fs.readFileSync(input, "utf8").replace(/^---[\s\S]*?---\s*/, ""); } catch { return ""; }
}
function description(data) {
  if (data.description || data.summary) return data.description || data.summary;
  if (data.tag) return "Guides and essays about " + data.tag.replace(/-/g, " ") + " by Yashank Kothari, a data engineer and software builder in Mumbai.";
  const paragraph = rawContent(data).split(/\n\s*\n/).find((p) => p.trim() && !/^(#|<|!|\{)/.test(p.trim()));
  if (paragraph) {
    const text = paragraph.replace(/!?\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_\x60]/g, "").replace(/\s+/g," ").trim();
    const sentence = text.match(/^(.{50,170}?[.!?])(?:\s|$)/);
    return sentence ? sentence[1] : text.length > 170 ? text.slice(0,167).replace(/\s+\S*$/, "") + "…" : text;
  }
  return "Yashank Kothari, data engineer in Mumbai. Data systems, local AI, software, games, and notes from building things.";
}
const canonical = (data) => new URL(data.page && data.page.url || "/", data.site && data.site.url || SITE_URL).href;
const isPost = (data) => Array.isArray(data.tags) && data.tags.includes("post");
const iso = (value) => new Date(value).toISOString();
function image(data) {
  const raw = rawContent(data);
  const found = raw.match(/<img[^>]*src=["']([^"']+)["']/);
  const img = data.thumb || data.image || (found && found[1]);
  return new URL(img || "/img/og.png", data.site && data.site.url || SITE_URL).href;
}
module.exports = {
  seoTitle: (data) => !data.title || data.title.toLowerCase() === "yashank kothari" ? "Yashank Kothari — Data Engineer & Builder" : data.title + " · Yashank Kothari",
  seoDescription: description,
  seoCanonical: canonical,
  seoImage: image,
  isBlogPost: isPost,
  seoSchema: (data) => {
    const url = canonical(data);
    const author = { "@type": "Person", name: "Yashank Kothari", url: (data.site && data.site.url || SITE_URL) + "/", sameAs: ["https://github.com/yashankkothari","https://www.linkedin.com/in/yashankkothari/"] };
    const schema = isPost(data) ? {
      "@context":"https://schema.org", "@type":"BlogPosting", headline:data.title,
      description:description(data), url, mainEntityOfPage:{"@type":"WebPage","@id":url},
      datePublished:iso(data.page.date), dateModified:iso(data.updated || data.page.date),
      author, ...(image(data) ? {image:image(data)} : {})
    } : { "@context":"https://schema.org", "@type": data.page && data.page.url === "/" ? "ProfilePage" : "WebPage", name:data.title || "Yashank Kothari", description:description(data), url, ...(data.page && data.page.url === "/" ? {mainEntity:author} : {author}) };
    return JSON.stringify(schema).replace(/</g, "\\u003c");
  }
};
