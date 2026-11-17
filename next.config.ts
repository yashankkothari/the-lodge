import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com https://us-assets.i.posthog.com https://eu-assets.i.posthog.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://i.scdn.co https://cdn.discordapp.com https://wsrv.nl https://flagcdn.com https://us.i.posthog.com https://eu.i.posthog.com",
      "font-src 'self' data:",
      "connect-src 'self' https://api.github.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://us.i.posthog.com https://us-assets.i.posthog.com https://eu.i.posthog.com https://eu-assets.i.posthog.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // The dev badge otherwise covers the phone's bottom-left Menu target.
  devIndicators: false,
  outputFileTracingIncludes: {
    "/**": ["./lib/fonts/**/*"],
    "/opengraph-image": ["./public/images/og/garden.png"],
  },
  images: {
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { hostname: "i.scdn.co" },
      { hostname: "cdn.discordapp.com" },
      { hostname: "wsrv.nl" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons", "date-fns"],
  },
  /* The previous Eleventy site served case studies at /work/<slug>/ and
     routed /portfolio/ to a "The Work" page. Keep those URLs alive so
     existing links and search results do not 404 after the switch. */
  async redirects() {
    return [
      { source: "/work/:slug", destination: "/project/:slug", permanent: true },
      { source: "/work/:slug/", destination: "/project/:slug", permanent: true },
      { source: "/blog/:slug/", destination: "/blog/:slug", permanent: true },
      { source: "/classic", destination: "/", permanent: true },
      { source: "/classic/:path*", destination: "/", permanent: true },
      { source: "/minimal", destination: "/", permanent: true },
      { source: "/stats", destination: "/portfolio", permanent: true },
      { source: "/tags/:tag", destination: "/blog/tags/:tag", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
