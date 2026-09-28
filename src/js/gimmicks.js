(function () {
  var root = document.documentElement;
  function effectsOn() { return root.dataset.effects !== "off"; }

  // --- console whisper ---
  console.log(
    "%cTHE LODGE%c\nYou opened the console. Of course you did.\nThe source is open: https://github.com/yashankkothari\nIf you're hiring: kothariyashank@gmail.com",
    "font: 20px 'Times New Roman'; letter-spacing: 6px; color: #8b0000;",
    "font: 12px 'Courier New'; color: #999;"
  );

  // --- tab title when you leave ---
  var title = document.title;
  var absent = ["come back.", "the owls are watching", "we saved your seat", "it is happening again"];
  document.addEventListener("visibilitychange", function () {
    document.title = document.hidden ? absent[Math.floor(Math.random() * absent.length)] : title;
  });

  // --- footer clock + personal visit count ---
  var clock = document.querySelector("[data-clock]");
  if (clock) {
    var fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Kolkata" });
    var tick = function () { clock.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 1000);
  }
  var visits = document.querySelector("[data-visits]");
  if (visits) {
    var n = 1, fresh = false;
    try {
      if (!sessionStorage.getItem("counted")) {
        n = (parseInt(localStorage.getItem("visits"), 10) || 0) + 1;
        localStorage.setItem("visits", n);
        sessionStorage.setItem("counted", "1");
        fresh = true;
      } else {
        n = parseInt(localStorage.getItem("visits"), 10) || 1;
      }
    } catch (e) {}
    // odometer: each digit is a wheel that rolls into place
    var digits = String(n).padStart(5, "0").split("");
    visits.innerHTML = "Your visit no. <span class=\"odometer" + (fresh ? " rolling" : "") + "\" aria-label=\"" + n + "\">" +
      digits.map(function (d, i) {
        var wheel = "";
        for (var k = 0; k <= +d; k++) wheel += "<span>" + k + "</span>";
        return "<span class=\"odo-digit\" aria-hidden=\"true\"><span class=\"odo-wheel\" style=\"--d:" + d + ";--i:" + i + "\">" + wheel + "</span></span>";
      }).join("") + "</span>" + (n > 1 ? " You keep coming back." : "");
  }

  // --- idle: are you still there? ---
  var idle = document.createElement("div");
  idle.className = "idle-veil";
  idle.setAttribute("aria-hidden", "true");
  idle.innerHTML = "<p>Are you still there?</p>";
  document.body.appendChild(idle);
  var idleTimer;
  function wake() {
    idle.classList.remove("show");
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { if (effectsOn()) idle.classList.add("show"); }, 90000);
  }
  ["mousemove", "keydown", "scroll", "touchstart", "click"].forEach(function (e) {
    window.addEventListener(e, wake, { passive: true });
  });
  wake();

  // --- konami code: enter the red room ---
  var code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  var pos = 0;
  window.addEventListener("keydown", function (e) {
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = k === code[pos] ? pos + 1 : (k === code[0] ? 1 : 0);
    if (pos === code.length) {
      pos = 0;
      var on = root.toggleAttribute("data-redroom");
      console.log(on ? "%cLet's rock." : "%cYou have left the Red Room.", "color:#8b0000;font-style:italic");
    }
  });
})();

// --- touch: three quick taps on the footer hint opens the red room ---
(function () {
  var hint = document.querySelector(".konami-hint");
  if (!hint) return;
  var taps = 0, timer;
  hint.addEventListener("click", function () {
    taps++;
    clearTimeout(timer);
    timer = setTimeout(function () { taps = 0; }, 700);
    if (taps === 3) {
      taps = 0;
      document.documentElement.toggleAttribute("data-redroom");
    }
  });
})();
