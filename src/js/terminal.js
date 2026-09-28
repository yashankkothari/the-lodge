// Terminal mode. Press ~ (or `) anywhere to open, Esc to close.
(function () {
  var root = document.documentElement;
  var data = null;
  var history = [];
  var hIndex = 0;

  var el = document.createElement("div");
  el.className = "terminal";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", "Terminal");
  el.hidden = true;
  el.innerHTML =
    '<div class="terminal-bar"><span>lodge — tty1</span><button type="button" aria-label="Close terminal">×</button></div>' +
    '<div class="terminal-out" aria-live="polite"></div>' +
    '<form class="terminal-line"><label><span class="terminal-prompt">guest@lodge:~$</span>' +
    '<input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Command"></label></form>';
  document.body.appendChild(el);

  var out = el.querySelector(".terminal-out");
  var input = el.querySelector("input");

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function print(html, cls) {
    var line = document.createElement("div");
    if (cls) line.className = cls;
    line.innerHTML = html;
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
  }
  function link(href, text) { return '<a href="' + esc(href) + '">' + esc(text) + "</a>"; }
  function go(path) {
    print("opening " + esc(path) + " …", "dim");
    setTimeout(function () {
      if (path.charAt(0) === "/" && window.lodgeNavigate) { close(); window.lodgeNavigate(path); }
      else location.href = path;
    }, 350);
  }

  var PAGES = { home: "/", work: "/portfolio/", portfolio: "/portfolio/", blog: "/blog/", transmissions: "/blog/", now: "/now/", resume: "/resume/", stats: "/stats/", uses: "/uses/" };

  function findProject(q) {
    q = (q || "").toLowerCase();
    return data.projects.filter(function (p) { return p.slug === q || p.title.toLowerCase() === q; })[0];
  }

  var commands = {
    help: function () {
      print([
        "<b>whoami</b>          who keeps this place",
        "<b>ls</b> [projects|posts|pages]",
        "<b>cat</b> &lt;project&gt;  |  <b>cat resume</b>",
        "<b>open</b> &lt;page|project&gt;   e.g. open notesaid, open now",
        "<b>skills</b>  <b>jobs</b>  <b>contact</b>  <b>date</b>",
        "<b>play</b>  <b>stop</b>  <b>theme</b>  <b>effects</b>  <b>clear</b>  <b>exit</b>",
        '<span class="dim">↑ ↓ for history. Tab to complete. There are other commands. Try some.</span>'
      ].join("<br>"));
    },
    whoami: function () {
      print("<b>" + esc(data.name) + "</b> — " + esc(data.location));
      print(esc(data.headline));
      print('<span class="dim">' + esc(data.bio) + "</span>");
    },
    ls: function (arg) {
      if (!arg || arg === "pages") {
        print(Object.keys(PAGES).filter(function (k, i, a) { return a.indexOf(k) === i && ["portfolio", "transmissions"].indexOf(k) < 0; })
          .map(function (k) { return link(PAGES[k], k + "/"); }).join("   "));
        if (arg) return;
      }
      if (!arg || arg === "projects") {
        data.projects.forEach(function (p) { print(esc(p.year) + "  " + link(p.url, p.slug) + '  <span class="dim">' + esc(p.summary) + "</span>"); });
        if (arg) return;
      }
      if (!arg || arg === "posts") {
        data.posts.forEach(function (p) { print('<span class="dim">' + esc(p.date) + "</span>  " + link(p.url, p.title)); });
        return;
      }
      print("ls: cannot access '" + esc(arg) + "': No such file or directory");
    },
    cat: function (arg) {
      if (!arg) return print("cat: what should I read?");
      if (arg === "resume" || arg === "resume.pdf") {
        data.jobs.forEach(function (j) { print("<b>" + esc(j.role) + "</b> @ " + esc(j.org) + ' <span class="dim">(' + esc(j.period) + ")</span>"); });
        data.education.forEach(function (e) { print("<b>" + esc(e.degree) + "</b>, " + esc(e.school) + ' <span class="dim">(' + esc(e.period) + ")</span>"); });
        return print("full version: " + link("/resume/", "/resume/"));
      }
      var p = findProject(arg);
      if (!p) return print("cat: " + esc(arg) + ": No such file. Try <b>ls projects</b>.");
      print("<b>" + esc(p.title) + "</b> (" + esc(p.year) + ")");
      print(esc(p.summary));
      print('<span class="dim">' + esc(p.tech.join(" · ")) + "</span>");
      print(link(p.url, "read the case file") + (p.source ? "  " + link(p.source, "source") : ""));
    },
    open: function (arg) {
      if (!arg) return print("open: open what?");
      if (PAGES[arg]) return go(PAGES[arg]);
      var p = findProject(arg);
      if (p) return go(p.url);
      if (arg === "github") return go(data.github);
      if (arg === "linkedin") return go(data.linkedin);
      print("open: " + esc(arg) + ": this door does not open.");
    },
    skills: function () {
      data.skills.forEach(function (s) { print("<b>" + esc(s.group) + "</b>  " + esc(s.items)); });
    },
    jobs: function () {
      data.jobs.forEach(function (j) { print(esc(j.period) + "  <b>" + esc(j.role) + "</b> @ " + esc(j.org)); });
    },
    contact: function () {
      print("mail      " + link("mailto:" + data.email, data.email));
      print("github    " + link(data.github, data.github));
      print("linkedin  " + link(data.linkedin, data.linkedin));
    },
    date: function () {
      print(new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata" }) + " IST. Or is it.");
    },
    theme: function () { var b = document.querySelector(".theme-toggle:not(.effects-toggle)"); if (b) b.click(); print("theme: " + root.dataset.theme); },
    effects: function () { var b = document.querySelector(".effects-toggle"); if (b) b.click(); print("effects: " + root.dataset.effects); },
    clear: function () { out.innerHTML = ""; },
    exit: function () { close(); },
    // --- the other commands ---
    sudo: function () { print("guest is not in the sudoers file. This incident will be reported to the Log Lady."); },
    redroom: function () { root.toggleAttribute("data-redroom"); print(root.hasAttribute("data-redroom") ? "Let's rock." : "You have left the Red Room."); },
    play: function () {
      if (!window.lodgeRadio) return print("the radio is not in this room.");
      if (window.lodgeRadio.playing()) return print("it is already playing. listen.");
      window.lodgeRadio.toggle(); print("tuning in…");
    },
    stop: function () {
      if (window.lodgeRadio && window.lodgeRadio.playing()) { window.lodgeRadio.toggle(); print("silence."); }
      else print("nothing is playing. or is it.");
    },
    coffee: function () { print("Damn fine coffee. And hot."); },
    owls: function () { print("The owls are not what they seem."); },
    pwd: function () { print("/home/guest/" + (location.pathname.replace(/^\/|\/$/g, "") || "lodge")); },
    echo: function (arg, raw) { print(esc(raw)); },
    rm: function () { print("rm: nothing here can be deleted. It will all happen again."); },
    hire: function () { print("Good choice. " + link("mailto:" + data.email + "?subject=Let's%20talk", "Send the letter.")); }
  };
  commands.cd = commands.open;
  commands["?"] = commands.help;

  function run(raw) {
    raw = raw.trim();
    print('<span class="terminal-prompt">guest@lodge:~$</span> ' + esc(raw));
    if (!raw) return;
    history.push(raw);
    hIndex = history.length;
    var parts = raw.split(/\s+/);
    var cmd = parts[0].toLowerCase();
    var arg = (parts[1] || "").toLowerCase().replace(/\/$/, "");
    if (commands[cmd]) commands[cmd](arg, parts.slice(1).join(" "));
    else print(esc(cmd) + ": command not found. Type <b>help</b>.");
  }

  function load() {
    if (data) return Promise.resolve();
    return fetch("/terminal.json").then(function (r) { return r.json(); }).then(function (d) { data = d; });
  }

  function open() {
    el.hidden = false;
    root.classList.add("terminal-open");
    input.focus();
    if (!out.childNodes.length) {
      load().then(function () {
        print("THE LODGE v2026 — last login: " + new Date().toDateString() + " from somewhere you don't remember", "dim");
        print("Type <b>help</b> to begin.");
      }).catch(function () { print("the signal is too weak to load. try again later."); });
    }
  }
  function close() {
    el.hidden = true;
    root.classList.remove("terminal-open");
  }

  el.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var v = input.value;
    input.value = "";
    load().then(function () { run(v); });
  });
  el.querySelector(".terminal-bar button").addEventListener("click", close);

  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowUp") { e.preventDefault(); if (hIndex > 0) input.value = history[--hIndex]; }
    else if (e.key === "ArrowDown") { e.preventDefault(); hIndex = Math.min(history.length, hIndex + 1); input.value = history[hIndex] || ""; }
    else if (e.key === "Tab") {
      e.preventDefault();
      var words = Object.keys(commands).concat(Object.keys(PAGES), data ? data.projects.map(function (p) { return p.slug; }) : [], ["projects", "posts", "pages", "resume"]);
      var parts = input.value.split(" ");
      var last = parts.pop().toLowerCase();
      var match = words.filter(function (w) { return last && w.indexOf(last) === 0; });
      if (match.length === 1) { parts.push(match[0]); input.value = parts.join(" ") + " "; }
      else if (match.length > 1) print(match.join("  "), "dim");
    }
    else if (e.key === "Escape") close();
  });

  document.addEventListener("keydown", function (e) {
    var t = e.target;
    var typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
    if (!typing && (e.key === "~" || e.key === "`")) { e.preventDefault(); el.hidden ? open() : close(); }
    else if (e.key === "Escape" && !el.hidden) close();
  });

  var opener = document.querySelector("[data-terminal-open]");
  if (opener) opener.addEventListener("click", function (e) { e.preventDefault(); open(); });
})();
