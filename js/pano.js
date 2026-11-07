// pano.js — 360° viewer in plain WebGL (per-pixel ray → equirectangular photo)
import { $, $$, json, ready, esc, tt, BASE } from './main.js?v=2ee4318a';

const FS = `precision mediump float;uniform sampler2D t;uniform vec2 r;uniform float y,x,f;
void main(){vec3 d=normalize(vec3((gl_FragCoord.xy*2.-r)/r.y*f,-1.));float c=cos(x),s=sin(x);d=vec3(d.x,d.y*c-d.z*s,d.y*s+d.z*c);
c=cos(y);s=sin(y);d=vec3(d.x*c-d.z*s,d.y,d.x*s+d.z*c);gl_FragColor=texture2D(t,vec2(.5+atan(d.x,-d.z)/6.2832,.5-asin(d.y)/3.1416));}`;
const clamp = v => Math.max(-1.3, Math.min(1.3, v));

function viewer(box) {
  const cv = document.createElement('canvas'), gl = cv.getContext('webgl');
  if (!gl) return;
  cv.tabIndex = 0; cv.role = 'img'; cv.ariaLabel = tt('صورة 360° — اسحب أو استعمل الأسهم', 'Photo 360° — faites glisser ou utilisez les flèches', '360° photo — drag or use the arrow keys');
  box.prepend(cv);
  const p = gl.createProgram();
  [[gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'], [gl.FRAGMENT_SHADER, FS]].forEach(([k, src]) => {
    const o = gl.createShader(k); gl.shaderSource(o, src); gl.compileShader(o); gl.attachShader(p, o);
  });
  gl.linkProgram(p); gl.useProgram(p);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  const u = n => gl.getUniformLocation(p, n), v = { y: 0, x: 0, f: .7 };
  let raf, px, py, id;
  const draw = () => {
    raf = 0;
    const k = Math.min(devicePixelRatio, 1.5), w = Math.round(cv.clientWidth * k), h = Math.round(cv.clientHeight * k);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
    gl.uniform2f(u('r'), w, h); gl.uniform1f(u('y'), v.y); gl.uniform1f(u('x'), v.x); gl.uniform1f(u('f'), v.f);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const ask = () => { box.classList.add('touched'); raf ||= requestAnimationFrame(draw); };
  new ResizeObserver(() => (raf ||= requestAnimationFrame(draw))).observe(cv);
  cv.onpointerdown = e => { id = e.pointerId; px = e.clientX; py = e.clientY; cv.setPointerCapture(id); };
  cv.onpointermove = e => {
    if (e.pointerId !== id) return;
    const k = 2 * v.f / cv.clientHeight;
    v.y -= (e.clientX - px) * k;
    if (e.pointerType === 'mouse') v.x = clamp(v.x + (e.clientY - py) * k);
    px = e.clientX; py = e.clientY; ask();
  };
  cv.onpointerup = cv.onpointercancel = () => (id = null);
  cv.onkeydown = e => {
    const d = { ArrowLeft: [-.15, 0], ArrowRight: [.15, 0], ArrowUp: [0, .1], ArrowDown: [0, -.1] }[e.key];
    d && (e.preventDefault(), (v.y += d[0]), (v.x = clamp(v.x + d[1])), ask());
  };
  cv.addEventListener('wheel', e => { e.preventDefault(); v.f = Math.max(.35, Math.min(1, v.f * (e.deltaY > 0 ? 1.08 : .93))); ask(); }, { passive: false });
  return (src, yaw = 0, pitch = 0) => new Promise(ok => {
    const im = new Image();
    im.onload = () => {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      v.y = yaw; v.x = pitch; raf ||= requestAnimationFrame(draw); ok();
    };
    im.src = src;
  });
}

// Loads on «ابدأ الجولة» only. Delegated, so boxes added later (venues.html builds its zones from JSON) work too.
// data-only="id,id" limits a box to its own scenes (e.g. the conference room).
ready.then(() => json('data/panos.json')).then(all => addEventListener('click', e => {
  const start = e.target.closest('.pano-start'), box = start?.closest('.pano');
  if (!box || box.classList.contains('live')) return;
  const nav = $('.pano-scenes', box), only = box.dataset.only?.split(',');
  const scenes = only ? all.filter(s => only.includes(s.id)) : all;
  {
    const load = viewer(box);
    if (!load) return (start.textContent = tt('متصفحك لا يدعم العرض 360°', 'Votre navigateur ne prend pas en charge la vue 360°', 'Your browser does not support the 360° view'));
    const go = s => {
      box.ariaBusy = true;
      load(`${BASE}img/360/${s.id}${innerWidth < 900 ? '-m' : ''}.jpg`, s.yaw, s.pitch).then(() => (box.ariaBusy = false));
      $$('button', nav).forEach(b => b.setAttribute('aria-pressed', b.dataset.id === s.id));
    };
    nav.innerHTML = scenes.length > 1 ? scenes.map(s => `<button type="button" data-id="${s.id}">${esc(s.title)}</button>`).join('') : '';
    nav.onclick = e => { const b = e.target.closest('[data-id]'); b && go(scenes.find(s => s.id === b.dataset.id)); };
    box.classList.add('live');
    go(scenes.find(s => s.id === box.dataset.initial) || scenes[0]);
    $('canvas', box).focus({ preventScroll: true });
  }
}));
