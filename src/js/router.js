// In-place navigation. Internal links fetch the next page and swap only <main>,
// so the header, footer and the radio are never torn down (the music keeps playing).
// Anything unusual (other sites, files, errors) falls back to a normal page load.
(function () {
  if (!window.fetch || !window.DOMParser || !history.pushState) return;
  var root = document.documentElement;
  var cache = {};
  var navId = 0;
  var shown = location.pathname + location.search; // the page currently in <main>

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  history.replaceState({ scroll: 0 }, "", location.href);

  function effectsOn() { return root.dataset.effects !== "off"; }
  function key(url) { return url.pathname + url.search; }

  // which links we take over
  function eligible(a, e) {
    if (!a || !a.href) return null;
    if (e && (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) return null;
    if (a.hasAttribute("download") || (a.target && a.target !== "_self")) return null;
    var href = a.getAttribute("href") || "";
    if (!href || href.charAt(0) === "#") return null;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return null;
    if (/\.[a-z0-9]+$/i.test(url.pathname) && !/\.html$/i.test(url.pathname)) return null; // pdf, mp3, json…
    return url;
  }

  function get(url) {
    var k = key(url);
    if (!cache[k]) {
      cache[k] = fetch(k, { headers: { Accept: "text/html" } }).then(function (res) {
        var type = res.headers.get("content-type") || "";
        if (!res.ok || type.indexOf("text/html") < 0) throw new Error("not a page");
        return res.text();
      }).then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var main = doc.querySelector("main");
        if (!main) throw new Error("no main");
        return { title: doc.title, main: main.innerHTML };
      });
      cache[k].catch(function () { delete cache[k]; });
    }
    return cache[k];
  }

  function scrollFor(url, y) {
    if (url.hash) {
      var target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (target) { target.scrollIntoView(); return; }
    }
    window.scrollTo(0, y || 0);
  }

  function go(url, opts) {
    opts = opts || {};
    var id = ++navId;
    root.classList.add("routing");
    get(url).then(function (page) {
      if (id !== navId) return; // a newer click won
      if (opts.push) {
        // remember where we were on the page we are leaving
        history.replaceState({ scroll: window.scrollY }, "", location.href);
        history.pushState({ scroll: 0 }, "", url.href);
      }
      var main = document.querySelector("main");
      function swap() {
        main.innerHTML = page.main;
        shown = key(url);
        document.title = page.title;
        scrollFor(url, opts.scroll);
        if (window.lodgeTypewriter) window.lodgeTypewriter(120);
      }
      if (document.startViewTransition && effectsOn() && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.startViewTransition(swap);
      } else {
        swap();
      }
      // move focus for keyboard and screen reader users, without jumping the page
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
      root.classList.remove("routing");
      document.dispatchEvent(new CustomEvent("lodge:navigated", { detail: { url: url.href } }));
    }).catch(function () {
      location.href = url.href; // fall back to an ordinary load
    });
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a");
    var url = eligible(a, e);
    if (!url) return;
    // same page, just a different #section: let the browser scroll
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
    e.preventDefault();
    if (url.href === location.href) return;
    go(url, { push: true });
  });

  // warm the cache on hover / touch so the swap is instant
  function warm(e) {
    var a = e.target.closest && e.target.closest("a");
    var url = eligible(a);
    if (url && url.pathname !== location.pathname) get(url).catch(function () {});
  }
  document.addEventListener("mouseover", warm, { passive: true });
  document.addEventListener("touchstart", warm, { passive: true });
  document.addEventListener("focusin", warm);

  window.addEventListener("popstate", function (e) {
    var url = new URL(location.href);
    // only the #section changed: no need to swap anything
    if (key(url) === shown) { scrollFor(url, e.state && e.state.scroll); return; }
    go(url, { push: false, scroll: e.state && e.state.scroll });
  });

  // let other scripts (the terminal) navigate the same way
  window.lodgeNavigate = function (path) { go(new URL(path, location.href), { push: true }); };
})();
