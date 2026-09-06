// The ragebait pet: a baby pressed against the glass, snot smearing down,
// tongue licking the screen. Pure CSS/SVG; each spawn gets its own spot.
export function babyHtml(url?: string | null, index = 0): string {
  const host = url ? new URL(url).hostname.replace(/^www\./, "") : "";
  const taunt = host ? `${host} again?` : "back to work.";
  const x = 10 + ((index * 37) % 70);
  const y = 10 + ((index * 53) % 60);
  return `<!doctype html><meta charset="utf-8">
<style>
  html,body{margin:0;height:100%;background:transparent;overflow:hidden;font-family:system-ui}
  .baby{position:absolute;left:${x}vw;top:${y}vh;width:min(28vw,320px);animation:press .6s ease-out both}
  .baby svg{width:100%;display:block;filter:drop-shadow(0 0 24px rgba(255,255,255,.45))}
  .tongue{transform-origin:150px 178px;animation:lick 1.1s ease-in-out infinite}
  .snot{transform-origin:118px 150px;animation:drip 2.4s ease-in infinite}
  .smear{position:absolute;left:35%;top:70%;width:22%;height:50%;
    background:linear-gradient(rgba(150,230,120,.75),rgba(150,230,120,0));
    border-radius:40% 40% 60% 60%;filter:blur(3px);animation:smear 2.4s ease-in infinite}
  .taunt{position:absolute;top:100%;left:0;right:0;text-align:center;color:#fff;font-weight:800;
    font-size:clamp(14px,2vw,28px);text-shadow:0 2px 8px #000;animation:shake .3s infinite}
  @keyframes press{from{transform:scale(.3);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes lick{0%,100%{transform:scaleY(.4) translateY(0)}50%{transform:scaleY(1.3) translateY(14px)}}
  @keyframes drip{0%{transform:scaleY(0)}70%{transform:scaleY(1)}100%{transform:scaleY(1);opacity:0}}
  @keyframes smear{0%{height:0}70%{height:50%}100%{height:50%;opacity:0}}
  @keyframes shake{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
</style>
<div class="baby">
  <svg viewBox="0 0 300 300">
    <ellipse cx="150" cy="140" rx="120" ry="110" fill="#f6c9b0"/>
    <ellipse cx="150" cy="150" rx="112" ry="100" fill="#fbd8c2"/>
    <ellipse cx="105" cy="120" rx="22" ry="12" fill="#fff"/><circle cx="105" cy="120" r="9" fill="#222"/>
    <ellipse cx="195" cy="120" rx="22" ry="12" fill="#fff"/><circle cx="195" cy="120" r="9" fill="#222"/>
    <ellipse cx="105" cy="120" rx="30" ry="18" fill="rgba(255,255,255,.35)"/>
    <ellipse cx="195" cy="120" rx="30" ry="18" fill="rgba(255,255,255,.35)"/>
    <ellipse cx="150" cy="150" rx="14" ry="10" fill="#e8a88f"/>
    <path class="snot" d="M118 150 q-6 40 4 70 q8 -20 2 -70z" fill="#9ee878"/>
    <ellipse cx="150" cy="185" rx="60" ry="36" fill="#f0a3b0"/>
    <ellipse cx="150" cy="178" rx="60" ry="26" fill="#c9424f"/>
    <ellipse class="tongue" cx="150" cy="200" rx="34" ry="30" fill="#ff7a8a"/>
    <ellipse cx="70" cy="165" rx="18" ry="10" fill="#ff9aa2" opacity=".7"/>
    <ellipse cx="230" cy="165" rx="18" ry="10" fill="#ff9aa2" opacity=".7"/>
  </svg>
  <div class="smear"></div>
  <div class="taunt">${taunt}</div>
</div>`;
}
