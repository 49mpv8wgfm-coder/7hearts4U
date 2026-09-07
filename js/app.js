"use strict";

const DEFAULT_MANIFEST = {"meta": {"title": "7♥ — Seven Hearts", "stat": "Reception MVP · ♥♥♥♥♥♥♥ / 7", "footer": "Deck of 7 · No other matches exist · This is the whole app.", "bakedRanks": true}, "back": "OldDemo/assets/back-crimson-velvet.svg", "jokers": ["assets/cards/joker-a.svg", "assets/cards/joker-b.svg", "assets/cards/joker-c.svg"], "fx": {"felt": "assets/fx/felt-table.svg", "grain": "assets/fx/paper-grain.svg", "rose": "OldDemo/assets/rose-red.svg", "petals": ["assets/fx/petal-1.svg", "assets/fx/petal-2.svg", "assets/fx/petal-3.svg", "assets/fx/petal-4.svg", "assets/fx/petal-5.svg"]}, "finale": {"message": "The magician made your card appear in his pocket. You made the whole evening look effortless. Thank you.", "sign": "— your plus-one ♥"}, "jokerLines": ["You must be a joker! 🃏", "The deck has voted. Motion denied.", "Jokers only. Try the other way →"], "toasts": ["Nice try.", "Still no.", "The hearts are watching."], "cards": [{"rank": "A", "img": "OldDemo/assets/ace_of_hearts.svg", "tag": "#FirstTimeCEO", "quip": "Boss of the boardroom, queen of the reception."}, {"rank": "2", "img": "OldDemo/assets/2_of_hearts.svg", "tag": "#WitConfirmed", "quip": "Five minutes in: certification renewed."}, {"rank": "3", "img": "OldDemo/assets/3_of_hearts.svg", "tag": "#EyesThatBeLashin", "quip": "Objection overruled. The lashes stand."}, {"rank": "4", "img": "OldDemo/assets/4_of_hearts.svg", "tag": "#CalculusOfCuteitude", "quip": "Ran the numbers. The math checks out."}, {"rank": "5", "img": "OldDemo/assets/5_of_hearts.svg", "tag": "#GorgeousAndCurious", "quip": "A rare and dangerous combination."}, {"rank": "6", "img": "OldDemo/assets/6_of_hearts.svg", "tag": "#TakingTheReigns", "quip": "Courage looks good on you."}, {"rank": "7", "img": "OldDemo/assets/7_of_hearts.svg", "tag": "#ExceptionalCompany", "quip": "Of all the cards in the deck…"}]};

const $ = s => document.querySelector(s);
const els = {
  pips: $("#pips"), deck: $("#deck"), intro: $("#intro"), introCard: $("#introCard"),
  introBack: $("#introBack"), introFace: $("#introFace"),
  jokerOverlay: $("#jokerOverlay"), jokerRain: $("#jokerRain"),
  jokerMsg: $("#jokerMsg"), finale: $("#finale"), petals: $("#petals"),
  finalCard: $("#finalCard"), finalMsg: $("#finalMsg"), finalSign: $("#finalSign"),
  roseHero: $("#roseHero"), replay: $("#replay"), toast: $("#toast"),
  controls: $("#controls"), btnNo: $("#btnNo"), btnInfo: $("#btnInfo"), btnYes: $("#btnYes")
};
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

let M = null, idx = 0, gagCount = 0, busy = false;
let cardEls = [], petalImgs = [];
let g = null, lastTouch = 0;

async function boot(){
  try { const r = await fetch("assets/manifest.json", {cache:"no-store"}); M = await r.json(); }
  catch(e) { M = DEFAULT_MANIFEST; }
  els.introBack.src = M.back;
  els.introFace.src = M.cards[0].img;
  els.roseHero.src = M.fx.rose;
  els.finalMsg.textContent = M.finale.message;
  els.finalSign.textContent = M.finale.sign;
  buildPips(); preload(); wireControls(); wireKeyboard();
  els.introCard.addEventListener("click", onIntroTap);
  els.replay.addEventListener("click", reset);
}

function onIntroTap(){
  if (busy) return;
  busy = true;
  els.introCard.classList.add("flipped");
  setTimeout(start, REDUCED ? 0 : 620);
}

function buildPips(){
  els.pips.innerHTML = "";
  for(let i=0;i<M.cards.length;i++){
    const s = document.createElement("span"); s.textContent = "\u2665"; els.pips.appendChild(s);
  }
}
function setPips(){
  [...els.pips.children].forEach((s,i)=> s.classList.toggle("on", i < idx));
}
function preload(){
  const srcs = [M.back, M.fx.rose, ...M.jokers, ...M.cards.map(c=>c.img)];
  srcs.forEach(s => { const im = new Image(); im.src = s; });
  petalImgs = M.fx.petals.map(s => { const im = new Image(); im.src = s; return im; });
}

function wireControls(){
  els.btnYes.addEventListener("click", ()=>{ if(!busy && cardEls[idx]) fling(cardEls[idx]); });
  els.btnNo.addEventListener("click", ()=>{ if(!busy && cardEls[idx]) joker(); });
  els.btnInfo.addEventListener("click", ()=>{
    if (busy) return;
    const el = cardEls[idx]; if(!el) return;
    if (el.classList.contains("flipped")) el.classList.remove("flipped");
    else flipUp(el);
  });
}

function wireKeyboard(){
  window.addEventListener("keydown", e=>{
    if (els.deck.hidden || busy) return;
    const el = cardEls[idx]; if(!el) return;
    if (e.key === "ArrowRight") fling(el);
    else if (e.key === "ArrowLeft") joker();
    else if (e.key === "ArrowUp" || e.key === " " || e.key === "i"){
      e.preventDefault();
      if (el.classList.contains("flipped")) el.classList.remove("flipped"); else flipUp(el);
    }
    else if (e.key === "Escape") el.classList.remove("flipped");
  });
}

function start(){
  els.intro.hidden = true;
  els.deck.hidden = false;
  els.controls.hidden = false;
  buildDeck(); layout(); dealAnim();
  busy = false;
}

function cardEl(c){
  const baked = M.meta && M.meta.bakedRanks;
  const corners = baked ? "" :
    '<div class="corner tl"><span class="rank">' + c.rank + '</span><span class="pip">\u2665</span></div>' +
    '<div class="corner br"><span class="rank">' + c.rank + '</span><span class="pip">\u2665</span></div>';
  const el = document.createElement("article");
  el.className = "card under";
  el.innerHTML =
    '<div class="flip">' +
      '<div class="face front">' +
        '<img class="art" src="' + c.img + '" alt="' + c.rank + ' of hearts">' +
        corners +
        '<div class="stamp yes">DEALT \u2665</div>' +
        '<div class="stamp no">JOKER?</div>' +
        '<div class="caption">' +
          '<div class="chip tag">' + c.tag + '</div>' +
          '<p class="quip-front">' + c.quip + '</p>' +
          '<p class="hintline">swipe &middot; or use the buttons</p>' +
        '</div>' +
      '</div>' +
      '<div class="face backface">' +
        '<div class="rank big">' + c.rank + '<span class="suit">\u2665</span></div>' +
        '<div class="chip big">' + c.tag + '</div>' +
        '<p class="quip deal-in" data-text="' + c.quip + '"></p>' +
        '<p class="stat deboss">' + M.meta.stat + '</p>' +
        '<p class="foot deboss">' + M.meta.footer + '</p>' +
      '</div>' +
    '</div>';
  attachGestures(el);
  return el;
}

function attachGestures(el){
  el.addEventListener("touchstart", e=>{
    lastTouch = Date.now();
    gStart(el, e.changedTouches[0].clientX, e.changedTouches[0].clientY, "touch");
  }, {passive:true});
  el.addEventListener("mousedown", e=>{
    if (Date.now() - lastTouch < 700) return;
    gStart(el, e.clientX, e.clientY, "mouse");
  });
}

function gStart(el, x, y, mode){
  if (g || busy || !el.classList.contains("top")) return;
  if (el.classList.contains("flipped")){ el.classList.remove("flipped"); return; }
  g = {el, x0:x, y0:y, dx:0, dy:0, moved:false, mode};
  el.classList.add("drag");
}

function gMove(x, y){
  if (!g) return;
  g.dx = x - g.x0; g.dy = y - g.y0;
  if (Math.abs(g.dx) + Math.abs(g.dy) > 10) g.moved = true;
  g.el.style.transform = "translate(" + g.dx + "px," + g.dy + "px) rotate(" + (g.dx/14) + "deg)";
  g.el.querySelector(".stamp.yes").style.opacity = Math.max(0, Math.min(g.dx/90, 1));
  g.el.querySelector(".stamp.no").style.opacity = Math.max(0, Math.min(-g.dx/90, 1));
}

function gEnd(cancelled){
  if (!g) return;
  const {el, dx, dy, moved} = g; g = null;
  el.classList.remove("drag");
  el.querySelector(".stamp.yes").style.opacity = 0;
  el.querySelector(".stamp.no").style.opacity = 0;
  el.style.transform = "";
  if (cancelled) return;
  if (!moved){
    if (el.classList.contains("flipped")) el.classList.remove("flipped"); else flipUp(el);
    return;
  }
  if (dy < -80 && Math.abs(dy) > Math.abs(dx)*1.1){ flipUp(el); return; }
  if (dx > 90){ fling(el); return; }
  if (dx < -90){ joker(); return; }
}

window.addEventListener("touchmove", e=>{
  if (!g || g.mode !== "touch") return;
  e.preventDefault();
  gMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
}, {passive:false});
window.addEventListener("touchend", e=>{
  if (!g || g.mode !== "touch") return;
  const t = e.changedTouches[0];
  if (t) gMove(t.clientX, t.clientY);
  gEnd(false);
});
window.addEventListener("touchcancel", ()=>{ gEnd(true); });
window.addEventListener("mousemove", e=>{ if (g && g.mode === "mouse") gMove(e.clientX, e.clientY); });
window.addEventListener("mouseup", ()=>{ if (g && g.mode === "mouse") gEnd(false); });

function buildDeck(){
  els.deck.innerHTML = "";
  cardEls = M.cards.map(cardEl);
  cardEls.forEach(el => els.deck.appendChild(el));
}

function layout(){
  cardEls.forEach((el,i)=>{
    el.classList.remove("top","next","under","gone");
    if (i < idx) el.classList.add("gone");
    else if (i === idx) el.classList.add("top");
    else if (i === idx+1) el.classList.add("next");
    else el.classList.add("under");
  });
}

function dealAnim(){
  const top = cardEls[idx]; if(!top) return;
  top.querySelectorAll(".rank").forEach(r=>{
    r.classList.remove("settle"); void r.offsetWidth; r.classList.add("settle");
  });
}

function dealIn(el){
  const text = el.dataset.text || "";
  el.innerHTML = "";
  [...text].forEach((ch,i)=>{
    const s = document.createElement("span");
    s.textContent = ch; s.style.setProperty("--i", i);
    el.appendChild(s);
  });
}

function flipUp(el){
  el.classList.add("flipped");
  dealIn(el.querySelector(".quip"));
}

function fling(el){
  busy = true;
  el.style.transition = "transform .5s cubic-bezier(.3,.7,.4,1), opacity .5s";
  el.style.transform = "translate(140%,-8%) rotate(26deg)";
  el.style.opacity = 0;
  setTimeout(()=>{
    el.style.cssText = ""; idx++; setPips();
    if (idx >= M.cards.length){ finale(); }
    else { layout(); dealAnim(); }
    busy = false;
  }, 500);
}

function joker(){
  busy = true;
  const top = cardEls[idx];
  if (top && !REDUCED){
    top.classList.add("deny");
    setTimeout(()=> top.classList.remove("deny"), 580);
  }
  els.jokerMsg.textContent = M.jokerLines[Math.min(gagCount, M.jokerLines.length-1)];
  els.jokerRain.innerHTML = "";
  for(let i=0;i<18;i++){
    const im = document.createElement("img");
    im.src = M.jokers[i % M.jokers.length]; im.alt = "";
    im.style.left = (4 + Math.random()*88) + "%";
    im.style.width = (70 + Math.random()*44) + "px";
    im.style.setProperty("--d", (1.5 + Math.random()*1.1) + "s");
    im.style.setProperty("--dl", (Math.random()*0.7) + "s");
    im.style.setProperty("--r", (Math.random()*520 - 260) + "deg");
    els.jokerRain.appendChild(im);
  }
  const t0 = REDUCED ? 0 : 480;
  setTimeout(()=>{
    els.jokerOverlay.hidden = false;
    requestAnimationFrame(()=> els.jokerOverlay.classList.add("show"));
  }, t0);
  setTimeout(()=>{
    els.jokerOverlay.classList.remove("show");
    setTimeout(()=>{
      els.jokerOverlay.hidden = true;
      els.jokerRain.innerHTML = "";
    }, 400);
    toast(M.toasts[Math.min(gagCount, M.toasts.length-1)]);
    gagCount++; busy = false;
  }, t0 + 2500);
}

function toast(t){
  els.toast.textContent = t;
  els.toast.hidden = false;
  requestAnimationFrame(()=> els.toast.classList.add("show"));
  setTimeout(()=>{
    els.toast.classList.remove("show");
    setTimeout(()=> els.toast.hidden = true, 350);
  }, 1500);
}

function finale(){
  els.deck.hidden = true;
  els.controls.hidden = true;
  els.finale.hidden = false;
  if (REDUCED){ els.finalCard.classList.add("show"); return; }
  burst();
  setTimeout(()=> els.finalCard.classList.add("show"), 650);
}

function burst(){
  const cv = els.petals, ctx = cv.getContext("2d");
  const dpr = devicePixelRatio || 1;
  cv.width = innerWidth*dpr; cv.height = innerHeight*dpr;
  cv.style.opacity = 1; ctx.scale(dpr, dpr);
  const W = innerWidth, H = innerHeight, cx = W/2, cy = H*0.42;
  const P = [];
  for(let i=0;i<90;i++){
    const a = Math.random()*Math.PI*2, sp = 3 + Math.random()*8;
    P.push({x:cx, y:cy, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp-4,
      rot:Math.random()*6.28, vr:(Math.random()-.5)*.15,
      img:petalImgs[i % petalImgs.length], s:.35+Math.random()*.55,
      ph:Math.random()*6.28, emo:(i % 6 === 0), landed:false});
  }
  let t = 0;
  (function frame(){
    t++; ctx.clearRect(0,0,W,H);
    let alive = false;
    for(const p of P){
      if(!p.landed){
        p.vy += .14;
        p.x += p.vx + Math.sin(t*.06 + p.ph)*1.1;
        p.y += p.vy; p.rot += p.vr;
        if (p.y > H-28 && p.vy > 0){ p.y = H-28; p.landed = true; }
        alive = true;
      }
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      if (p.emo){
        ctx.font = Math.round(30 + 26*p.s) + "px Georgia,serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("\u{1F339}", 0, 0);
      } else {
        const w = 110*p.s;
        if (p.img.complete && p.img.naturalWidth) ctx.drawImage(p.img, -w/2, -w/2, w, w);
      }
      ctx.restore();
    }
    if (alive && t < 900) requestAnimationFrame(frame);
    else { cv.style.transition = "opacity 1.2s"; cv.style.opacity = 0; }
  })();
}

function reset(){
  idx = 0; gagCount = 0; busy = false;
  els.finale.hidden = true;
  els.finalCard.classList.remove("show");
  els.petals.style.opacity = 1;
  els.deck.hidden = true;
  els.controls.hidden = true;
  els.intro.hidden = false;
  els.introCard.classList.remove("flipped");
  setPips();
}

boot();
