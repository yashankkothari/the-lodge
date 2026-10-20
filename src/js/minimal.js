const root = document.documentElement;
const themeButton = document.getElementById("theme");
function labelTheme() {
  themeButton.setAttribute("aria-label", "Switch to " + (root.dataset.theme === "dark" ? "light" : "dark") + " theme");
}
if (themeButton) {
  labelTheme();
  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("t", root.dataset.theme); } catch {}
    labelTheme();
  });
}
document.querySelector("[data-print]")?.addEventListener("click", () => window.print());
const clock = document.querySelector("[data-clock]");
if (clock) {
  const format = new Intl.DateTimeFormat("en-GB", { hour:"2-digit", minute:"2-digit", timeZone:"Asia/Kolkata" });
  const tickClock = () => clock.textContent = format.format(new Date());
  tickClock(); setInterval(tickClock, 60000);
}

// Every article is present in the server-rendered HTML. Filtering only changes visibility.
const filters = [...document.querySelectorAll(".filters button")];
const search = document.getElementById("post-search");
const rows = [...document.querySelectorAll(".archive-row")];
let activeTopic = "all";
function filterPosts() {
  const term = (search?.value || "").trim().toLowerCase();
  let count = 0;
  rows.forEach((row) => {
    const matches = (activeTopic === "all" || row.dataset.tag === activeTopic) && row.dataset.search.includes(term);
    row.hidden = !matches;
    if (matches) count++;
  });
  document.querySelectorAll(".archive-year").forEach((group) => group.hidden = ![...group.querySelectorAll(".archive-row")].some((row) => !row.hidden));
  const empty = document.querySelector(".empty-search");
  if (empty) empty.hidden = count > 0;
  const status = document.querySelector(".search-status");
  if (status) status.textContent = count + (count === 1 ? " article" : " articles") + " shown";
}
filters.forEach((button) => button.addEventListener("click", () => {
  activeTopic = button.dataset.f;
  filters.forEach((item) => {
    item.classList.toggle("on", item === button);
    item.setAttribute("aria-pressed", String(item === button));
  });
  filterPosts();
}));
search?.addEventListener("input", filterPosts);

// The original pixel owl and three little chiptunes now live on /now/.
const O = [
"................","..##........##..","..###......###..","..############..",
".##############.",".#WWWW####WWWW#.",".#WPPW####WPPW#.",".#WPPW####WPPW#.",
".#WWWW#YY#WWWW#.",".######YY######.",".##BBBBBBBBBB##.",".#BB.BB.BB.BB##.",
"..#BBBBBBBBBB#..","...##########...","....Y......Y....","................"];
const cv = document.getElementById("owl"), g = cv && cv.getContext("2d");
function owl(blink) {
  const col = {"#":"#6b4f3a",W:"#f3ead8",P:blink?"#f3ead8":"#14110f",Y:getComputedStyle(root).getPropertyValue("--gold"),B:"#a98a6a"};
  g.clearRect(0,0,96,96);
  O.forEach((row,y) => [...row].forEach((c,x) => {
    if (c === ".") return;
    let k = c;
    if (blink && (c === "W" || c === "P") && y >= 5 && y <= 7) k = y === 7 ? "#" : "W";
    g.fillStyle = col[k]; g.fillRect(x*6,y*6,6,6);
  }));
}
if (g) {
  owl(false);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setInterval(() => {
    if (document.hidden || root.dataset.effects === "off") return;
    owl(true); setTimeout(() => owl(false),160);
  },3200);
}
const tracks = [{n:"night shift",s:[0,3,7,10,7,3,5,8],bpm:112},{n:"retry, idempotent",s:[0,4,7,11,9,7,4,2],bpm:96},{n:"local model, warm",s:[0,2,3,7,8,7,3,2],bpm:84}];
let ti=0,ctx,timer,step=0,start=0;
const $ = (id) => document.getElementById(id);
function note(f,t,d) {
  const oscillator=ctx.createOscillator(),volume=ctx.createGain();
  oscillator.type="square";oscillator.frequency.value=f;
  volume.gain.setValueAtTime(.05,t);volume.gain.exponentialRampToValueAtTime(.0001,t+d);
  oscillator.connect(volume).connect(ctx.destination);oscillator.start(t);oscillator.stop(t+d);
}
function tick() {
  const track=tracks[ti],beat=60/track.bpm/2,t=ctx.currentTime;
  note(220*2**(track.s[step%8]/12),t,beat*.9);
  if (step%4===0) note(110*2**(track.s[0]/12),t,beat*1.8);
  step++;$("fill").style.width=(step%32/32*100)+"%";
  const seconds=Math.floor((Date.now()-start)/1000);
  $("time").textContent=Math.floor(seconds/60)+":"+String(seconds%60).padStart(2,"0");
  timer=setTimeout(tick,beat*1000);
}
async function play() {
  ctx=ctx||new AudioContext();await ctx.resume();
  if(timer){clearTimeout(timer);timer=null;$("play").textContent="play";return}
  start=Date.now();$("play").textContent="pause";tick();
}
function go(direction) {
  ti=(ti+direction+tracks.length)%tracks.length;$("track").textContent=tracks[ti].n;step=0;
  if(timer){clearTimeout(timer);timer=null;play()}
}
if ($("play")) document.querySelectorAll(".ctl button").forEach((button) => button.addEventListener("click", () => button.dataset.a==="play"?play():go(button.dataset.a==="next"?1:-1)));
document.querySelectorAll(".graph").forEach((graph) => graph.scrollLeft=graph.scrollWidth);

// Native modal supports Escape and keeps keyboard focus inside the enlarged image.
const images = [...document.querySelectorAll(".post-body img, .shelf img")];
if (images.length) {
  const dialog = document.createElement("dialog");
  dialog.className="zoom-dialog";dialog.setAttribute("aria-label","Enlarged image");
  const close=document.createElement("button");close.type="button";close.textContent="Close ×";
  const big=document.createElement("img");
  dialog.append(close,big);document.body.append(dialog);
  let previousFocus;
  close.addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",(event)=>{
    const box=dialog.getBoundingClientRect();
    if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom) dialog.close();
  });
  dialog.addEventListener("close",()=>previousFocus?.focus());
  images.forEach((image)=>{
    image.classList.add("zoomable");image.tabIndex=0;image.setAttribute("role","button");
    image.setAttribute("aria-label","Enlarge "+(image.alt||"image"));
    const open=()=>{previousFocus=image;big.src=image.currentSrc||image.src;big.alt=image.alt;dialog.showModal()};
    image.addEventListener("click",open);
    image.addEventListener("keydown",(event)=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();open()}});
  });
}
