---
title: "Building a PWA That Works on a Crowded Bus"
date: 2025-02-15
tags: ["post", "backend", "guides"]
---

The real test for a study app isn't a fast laptop on college Wi-Fi. It's someone on a packed bus, one bar of signal, trying to open their notes ten minutes before an exam. If the app shows a spinner and then a dinosaur, it has failed at the one moment it mattered.

That's the problem I've been working on for NotesAid, a notes app for my classmates that's launching soon. It's a **progressive web app (PWA)**, and most of the effort has gone into making it behave well with bad or no network. Here's what I've learned.

## What makes something a PWA

A PWA is a website that can be installed and can work offline. Practically, that means three things:

1. Served over **HTTPS** (localhost is allowed during development).
2. A **web app manifest** describing how it looks when installed.
3. A **service worker** that intercepts network requests and can answer them from a cache.

## The manifest

The manifest is a JSON file linked from your HTML with `<link rel="manifest" href="/manifest.json">`:

```json
{
  "name": "NotesAid",
  "short_name": "NotesAid",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1f2937",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/maskable-512.png", "sizes": "512x512",
      "type": "image/png", "purpose": "maskable" }
  ]
}
```

`display: standalone` hides the browser UI so it feels like an app. Provide a **maskable** icon, or Android will put your logo in an awkward white circle. iOS supports home screen installation too, but has historically been more limited and still reads some Apple-specific meta tags, so test on an actual iPhone.

## The service worker

A service worker is a script that runs separately from your page and sits between it and the network. You register it from the page:

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

Its lifecycle has three events that matter:

- **install**: fires once for a new version. Pre-cache your app shell here.
- **activate**: fires when this version takes control. Clean up old caches here.
- **fetch**: fires for every request in scope. This is where caching strategies live.

```javascript
const SHELL_CACHE = 'shell-v3';
const SHELL = ['/', '/offline.html', '/app.css', '/app.js'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== SHELL_CACHE).map((k) => caches.delete(k)))
    )
  );
});
```

## Pick a caching strategy per kind of request

There's no single right strategy. The trick is matching each type of request to the one that fits.

**Cache-first**: check the cache, only go to the network on a miss. Best for things that never change once built, like versioned JS bundles, fonts and icons.

```javascript
async function cacheFirst(req) {
  const cached = await caches.match(req);
  return cached || fetch(req);
}
```

**Network-first**: try the network, fall back to cache if it fails. Best for content that must be fresh when possible, like an API response for a user's notes list. Add a timeout, otherwise a weak connection means waiting a long time before the fallback kicks in. On a bus, a request that hangs is worse than one that fails fast.

```javascript
async function networkFirst(req, cacheName, ms = 3000) {
  const cache = await caches.open(cacheName);
  try {
    const res = await Promise.race([
      fetch(req),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
    ]);
    cache.put(req, res.clone());
    return res;
  } catch {
    return (await cache.match(req)) || caches.match('/offline.html');
  }
}
```

**Stale-while-revalidate**: return the cached copy immediately, and fetch a fresh one in the background for next time. Best for content where slightly old is fine but speed matters, like a subject index or a shared note someone opened yesterday.

```javascript
async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const network = fetch(req).then((res) => {
    cache.put(req, res.clone());
    return res;
  }).catch(() => cached);
  return cached || network;
}
```

Then route in the fetch handler. Only handle `GET` requests; the Cache API won't store anything else.

```javascript
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, 'api-v1'));
  } else if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request, 'pages-v1'));
  }
});
```

In practice I'd use **Workbox** rather than hand-writing all of this; it implements these strategies with expiry and edge cases handled. But writing them once by hand is the best way to understand what Workbox is doing.

## The update flow

This is the part that surprised me most. When you deploy a new service worker, the browser installs it, but it sits in a **waiting** state until every tab using the old one is closed. Users with the app open all day may never get the update.

You can call `self.skipWaiting()` to activate immediately, but then the new worker may serve new assets to a page that loaded old ones, which can break things. The safer pattern is to detect the waiting worker, show a small "New version available, refresh" prompt, and only then tell it to skip waiting and reload the page.

Also: serve `sw.js` itself with no long-lived caching headers, so the browser can actually see new versions.

## Pitfalls I ran into, or nearly did

- **Caching opaque or error responses.** Check `res.ok` before putting a response in the cache, or you'll happily serve a cached 500 forever.
- **Unbounded caches.** Notes and images add up. Cap entries or age, and remember the browser can evict your storage under pressure.
- **Caching authenticated data on shared devices.** Clear user-specific caches on logout.
- **Writes while offline.** Reads are the easy half. For edits, queue them locally (IndexedDB) and sync when back online. Background Sync helps where supported, but don't rely on it everywhere; retry on app open as well.
- **Testing only on fast Wi-Fi.** Chrome DevTools has offline and slow-network throttling. Use them constantly, and test on a real low-end phone.

## What I'd tell my past self

Decide upfront which content must work offline, then pick a strategy per request type: cache-first for build assets, network-first with a short timeout for live data, stale-while-revalidate for everything that can be a little old. Version your caches, handle the waiting worker deliberately, and test with the network switched off. The bus is the real user.
