// Old-school motion: typewriter titles and CRT power-on cleanup.
// Page-to-page transitions live in router.js (in-place) and style.css (View Transitions).
// Everything here stays still when effects are off.
(function () {
  var root = document.documentElement;
  function effectsOn() { return root.dataset.effects !== "off"; }

  // --- CRT power-on: drop the class once the animation has played ---
  if (root.classList.contains("crt-on")) {
    setTimeout(function () { root.classList.remove("crt-on"); }, 1100);
  }

  // --- typewriter: the page title types itself out ---
  var run = 0;
  function typewriter(startDelay) {
    var h = document.querySelector("main h1");
    if (!h || !effectsOn() || h.children.length !== 0) return;
    var mine = ++run; // a newer page cancels an older one mid-typing
    var full = h.textContent.trim();
    h.setAttribute("aria-label", full);
    h.style.minHeight = h.offsetHeight + "px"; // hold the space so nothing jumps
    h.textContent = "";
    var typed = document.createElement("span");
    typed.setAttribute("aria-hidden", "true");
    var caret = document.createElement("span");
    caret.className = "tw-caret";
    caret.setAttribute("aria-hidden", "true");
    h.appendChild(typed);
    h.appendChild(caret);

    var i = 0;
    setTimeout(function type() {
      if (mine !== run) return;
      typed.textContent = full.slice(0, ++i);
      if (i < full.length) {
        // a little irregular, like a real carriage
        setTimeout(type, 35 + Math.random() * 70);
      } else {
        setTimeout(function () { caret.remove(); h.style.minHeight = ""; }, 2400);
      }
    }, startDelay);
  }

  typewriter(root.classList.contains("crt-on") ? 900 : 250);
  window.lodgeTypewriter = typewriter;
})();
