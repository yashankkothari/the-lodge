// The radio. Plays the "now playing" track, and keeps its place as you move between pages.
// Browsers only allow sound after a click, so nothing plays until the visitor presses play.
(function () {
  var btn = document.querySelector("[data-radio]");
  if (!btn) return;
  var root = document.documentElement;
  var label = btn.querySelector(".radio-label");
  var KEY = "radio";

  var audio = new Audio();
  audio.src = btn.dataset.src;
  audio.loop = true;
  audio.preload = "none";
  var VOLUME = 0.5;
  var wanted = false; // what the visitor asked for, independent of fades in progress

  function load() {
    try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save(playing) {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ playing: playing, time: audio.currentTime || 0, at: Date.now() }));
    } catch (e) {}
  }
  function show(text, state) {
    label.textContent = text;
    btn.setAttribute("aria-pressed", state === "on" ? "true" : "false");
    root.classList.toggle("radio-on", state === "on");
  }

  // volume fade so it never starts with a jolt
  var fadeTimer;
  function fadeTo(target, ms, done) {
    clearInterval(fadeTimer);
    var start = audio.volume, steps = Math.max(1, Math.round(ms / 30)), i = 0;
    fadeTimer = setInterval(function () {
      i++;
      audio.volume = Math.min(1, Math.max(0, start + (target - start) * (i / steps)));
      if (i >= steps) { clearInterval(fadeTimer); if (done) done(); }
    }, 30);
  }

  function play(fadeMs) {
    wanted = true;
    show("Tuning…", "loading");
    audio.volume = 0;
    return audio.play().then(function () {
      show("Pause", "on");
      fadeTo(VOLUME, fadeMs || 1500);
      save(true);
    });
  }
  function pause() {
    wanted = false;
    fadeTo(0, 300, function () { audio.pause(); });
    show("Play", "off");
    save(false);
  }

  btn.addEventListener("click", function () {
    if (btn.disabled) return;
    if (!wanted) {
      play().catch(function () { wanted = false; if (!btn.disabled) show("Play", "off"); });
    } else {
      pause();
    }
  });

  audio.addEventListener("error", function () {
    btn.disabled = true;
    btn.title = "No audio file found at " + btn.dataset.src;
    show("No signal", "off");
    save(false);
  });

  // carry on from where the last page left off
  var state = load();
  if (state.playing) {
    var elapsed = (Date.now() - (state.at || Date.now())) / 1000;
    audio.preload = "auto";
    audio.addEventListener("loadedmetadata", function () {
      var t = (state.time || 0) + elapsed;
      audio.currentTime = audio.duration ? t % audio.duration : t;
    }, { once: true });
    play(400).catch(function () {
      // the browser wants a fresh click on this page
      wanted = false;
      show("Resume", "off");
    });
  } else {
    show("Play", "off");
  }

  // remember the position while playing and when leaving the page
  setInterval(function () { if (!audio.paused) save(true); }, 1000);
  addEventListener("pagehide", function () { if (!audio.paused) save(true); });

  // show the track in the OS media controls
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({ title: btn.dataset.title, artist: btn.dataset.artist, album: "The Lodge" });
    navigator.mediaSession.setActionHandler("play", function () { play(); });
    navigator.mediaSession.setActionHandler("pause", pause);
  }

  // let the terminal reach the radio
  window.lodgeRadio = { toggle: function () { btn.click(); }, playing: function () { return !audio.paused; } };
})();
