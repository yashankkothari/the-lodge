---
title: "Building a PWA That Works on a Crowded Bus"
date: 2025-02-15
tags: ["post", "backend", "guides"]
---

I don't care how fast a study app loads on a developer's laptop with perfect Wi-Fi if it falls apart the second a student tries opening notes on a crowded bus. Picture ten minutes before an exam, one bar of signal, and all you get is a spinner followed by Chrome's dinosaur. That's a terrible study app, no matter how nice the landing page looks.

That was on my mind while building [NotesAid](/work/notesaid/), a notes app for my classmates. I wanted it to behave like a proper **progressive web app (PWA)**: something you can actually use when the connection disappears. The offline work turned out to be less glamorous and more important than a lot of the visible features.

## What makes something a PWA

A PWA is still a website. The useful difference is that you can install it and, if you've built it properly, keep using it without a connection. You need three pieces:

1. **HTTPS**, except when you're developing on localhost.
2. A **web app manifest** so the phone knows what it's installing.
3. A **service worker** to intercept requests and serve cached files when the network isn't there.

## The manifest

The manifest is just JSON. Link it in your HTML with `<link rel="manifest" href="/manifest.json">`:

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

`display: standalone` gets rid of the usual browser chrome. Add a **maskable** icon unless you want Android to stick your logo in an ugly white circle. iPhones can install PWAs too, although iOS has its own quirks and some Apple-specific meta tags. Test it on an actual iPhone. A simulator isn't going to tell you everything.

## The service worker

A service worker runs separately from the page and gets a say in how requests are handled. Register it like this:

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

There are three lifecycle events worth understanding before you start caching things:

- **install**: a new worker is being installed. Good time to cache the app shell.
- **activate**: the worker takes control. Get rid of caches from older versions.
- **fetch**: a request comes in. Decide whether to use the network or a cached response.

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

Trying to cache everything the same way is where people get into trouble. A versioned JavaScript file and someone's latest notes aren't the same problem.

**Cache-first**: use the cached copy if you have one; fetch only if you don't. This makes sense for versioned JS bundles, fonts and icons. Things that shouldn't change underneath you.

```javascript
async function cacheFirst(req) {
  const cached = await caches.match(req);
  return cached || fetch(req);
}
```

**Network-first**: ask the server first, then fall back to what you saved. I'd use this for a student's notes list, where the latest version matters. Put a timeout on it, though. On a bad connection, waiting forever for a response is barely better than being offline.

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

**Stale-while-revalidate**: show the cached version immediately while you fetch a newer one for next time. A subject index or a shared note someone viewed yesterday can usually afford to be a little old. The screen opening instantly matters more.

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

Now decide which strategy handles each URL. Keep this to `GET` requests; the Cache API isn't a place to put your writes.

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

For a real app I'd reach for **Workbox**. It already handles expiration and a pile of edge cases I don't want to rediscover. Still worth writing these functions yourself once. Otherwise you're just copying service-worker config and hoping it works.

## The update flow

The update flow is surprisingly annoying. You ship a new service worker and the browser can leave it **waiting** because an old tab is still using the previous one. Someone leaves NotesAid open all day, and the fix you deployed might as well not exist for them.

You *can* force it with `self.skipWaiting()`. But mixing a newly activated worker with a page that loaded older assets is a good way to break your own app. I'd rather show a little "New version available, refresh" prompt, then activate the worker and reload when the user agrees.

And don't give `sw.js` long-lived caching headers. The browser needs to notice that you changed it.

## Pitfalls I ran into, or nearly did

- **Caching failed responses.** Check `res.ok`. Otherwise you can accidentally save a server error and keep showing it long after the server is fine.
- **Letting caches grow forever.** PDFs, notes and images aren't free. Set limits, and remember the browser can throw stored data away when space gets tight.
- **Leaving someone's private notes in a shared device's cache.** Clear user-specific data when they log out.
- **Forgetting about offline edits.** Reading cached notes is easy compared to editing them. Queue changes in IndexedDB and sync later. Background Sync isn't supported consistently enough to be your only plan, so retry when the app opens too.
- **Only testing at home on good Wi-Fi.** Use DevTools' offline and throttling modes. Then try a genuinely slow phone. It exposes problems your laptop won't.

## What I'd do differently from day one

I'd start by writing down exactly which screens a student should be able to open with zero signal. Then choose the caching strategy for each one. Cache static files aggressively, give live data a short network timeout, and let less urgent content load from storage first. Version your caches and make the update prompt work. Most importantly, actually turn the internet off while testing. If your offline app has only ever been tested online, you don't really know if it works.
