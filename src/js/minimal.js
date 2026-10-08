// theme
const root=document.documentElement;
document.getElementById('theme').onclick=()=>{root.dataset.theme=root.dataset.theme==='light'?'dark':'light';localStorage.setItem('t',root.dataset.theme)};

// original pixel owl, blinks every few seconds
const O=[
"................",
"..##........##..",
"..###......###..",
"..############..",
".##############.",
".#WWWW####WWWW#.",
".#WPPW####WPPW#.",
".#WPPW####WPPW#.",
".#WWWW#YY#WWWW#.",
".######YY######.",
".##BBBBBBBBBB##.",
".#BB.BB.BB.BB##.",
"..#BBBBBBBBBB#..",
"...##########...",
"....Y......Y....",
"................"];
const cv=document.getElementById('owl'),g=cv&&cv.getContext('2d');
function owl(blink){const css=getComputedStyle(root);const col={'#':'#6b4f3a','W':'#f3ead8','P':blink?'#f3ead8':'#14110f','Y':css.getPropertyValue('--gold'),'B':'#a98a6a'};
 g.clearRect(0,0,96,96);O.forEach((r,y)=>[...r].forEach((c,x)=>{if(c==='.')return;let k=c;if(blink&&(c==='W'||c==='P')&&(y===5||y===6||y===7))k=(y===7?'#':'W');g.fillStyle=col[k]||col[c];g.fillRect(x*6,y*6,6,6)}))}
if(g){owl(false);setInterval(()=>{owl(true);setTimeout(()=>owl(false),160)},3200);}

// tiny original chiptune player (WebAudio, no files)
const tracks=[{n:'night shift',s:[0,3,7,10,7,3,5,8],bpm:112},{n:'retry, idempotent',s:[0,4,7,11,9,7,4,2],bpm:96},{n:'local model, warm',s:[0,2,3,7,8,7,3,2],bpm:84}];
let ti=0,ctx,timer,step=0,start=0;const len=32;
const $=id=>document.getElementById(id);
function note(f,t,d){const o=ctx.createOscillator(),v=ctx.createGain();o.type='square';o.frequency.value=f;v.gain.setValueAtTime(.05,t);v.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(v).connect(ctx.destination);o.start(t);o.stop(t+d)}
function tick(){const tr=tracks[ti],b=60/tr.bpm/2,t=ctx.currentTime;note(220*2**(tr.s[step%8]/12),t,b*.9);if(step%4===0)note(110*2**(tr.s[0]/12),t,b*1.8);step++;
 $('fill').style.width=(step%len/len*100)+'%';const s=Math.floor((Date.now()-start)/1000);$('time').textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');timer=setTimeout(tick,b*1000)}
function play(){ctx=ctx||new AudioContext();if(timer){clearTimeout(timer);timer=null;$('play').textContent='play';return}start=Date.now();$('play').textContent='pause';tick()}
function go(d){ti=(ti+d+tracks.length)%tracks.length;$('track').textContent=tracks[ti].n;step=0;if(timer){clearTimeout(timer);timer=null;play()}}
document.getElementById('play')&&document.querySelectorAll('.ctl button').forEach(b=>b.onclick=()=>b.dataset.a==='play'?play():go(b.dataset.a==='next'?1:-1));


// blog filters
const btns=document.querySelectorAll('.filters button');
btns.forEach(b=>b.onclick=()=>{btns.forEach(x=>x.classList.toggle('on',x===b));const f=b.dataset.f;
 document.querySelectorAll('.posts .post').forEach(p=>p.classList.toggle('hide',f!=='all'&&p.dataset.tag!==f));
 document.querySelectorAll('.posts .month').forEach(m=>{let n=m.nextElementSibling,vis=false;while(n&&!n.classList.contains('month')){if(!n.classList.contains('hide'))vis=true;n=n.nextElementSibling}m.classList.toggle('hide',!vis)})});

// commit graph: start scrolled to the most recent weeks on narrow screens
document.querySelectorAll('.graph').forEach(g => { g.scrollLeft = g.scrollWidth; });

// tap a diagram or screenshot to see it full size (pinch/pan on phones)
(function () {
  const imgs = document.querySelectorAll('.post-body img');
  if (!imgs.length) return;
  const box = document.createElement('div');
  box.className = 'zoom'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'image, tap to close');
  box.innerHTML = '<button type="button" aria-label="close">×</button><div class="zoom-scroll"><img alt=""></div>';
  document.body.appendChild(box);
  const big = box.querySelector('img');
  const close = () => { box.classList.remove('open'); document.documentElement.classList.remove('noscroll'); };
  box.querySelector('button').onclick = close;
  box.addEventListener('click', e => { if (e.target === box || e.target.classList.contains('zoom-scroll')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  imgs.forEach(img => {
    img.classList.add('zoomable'); img.tabIndex = 0;
    const open = () => { big.src = img.currentSrc || img.src; big.alt = img.alt; box.classList.add('open'); document.documentElement.classList.add('noscroll'); box.querySelector('.zoom-scroll').scrollLeft = 0; };
    img.addEventListener('click', open);
    img.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
  });
})();
