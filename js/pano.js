/* ===================================================
   HOTEL YOUCEF · pano.js — 360° panorama viewer (Three.js)
   Equirectangular 2:1 photos. Drag / swipe to look around, gyroscope on phones,
   zoom buttons, cross-fade between scenes, optional scroll-driven auto-turn.
   =================================================== */
import * as THREE from 'three';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const mobile = () => matchMedia('(max-width: 768px)').matches;

export function createPano(container, { onLoad, drift = 0.05, fadeSpeed = 1.6 } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.className = 'pano-canvas';
  canvas.setAttribute('role', 'img');
  container.prepend(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
  const geo = new THREE.SphereGeometry(50, 64, 40);
  geo.scale(-1, 1, 1); // look at the inside
  const layers = [0, 1].map(() => {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    scene.add(m);
    return m;
  });
  let front = 0;

  const loader = new THREE.TextureLoader();
  const cache = new Map();
  const state = { yaw: 0, pitch: 0, fov: 75, vyaw: 0, offset: 0, gyro: null, fade: 1, auto: true, dragging: false };
  let running = false, raf = 0, lastT = performance.now(), idleAt = 0;

  function load(pano) {
    const src = mobile() && pano.srcMobile ? pano.srcMobile : pano.src;
    canvas.setAttribute('aria-label', `صورة 360 درجة: ${pano.title}`);
    container.classList.add('loading');
    const ready = tex => {
      container.classList.remove('loading');
      const next = layers[1 - front];
      next.material.map = tex;
      next.material.needsUpdate = true;
      next.material.opacity = 0;
      next.renderOrder = 1; layers[front].renderOrder = 0;
      front = 1 - front;
      state.fade = 0;
      if (pano.yaw !== undefined) state.yaw = pano.yaw;
      if (pano.pitch !== undefined) state.pitch = pano.pitch;
      onLoad?.(pano);
      if (!running) renderOnce();
    };
    if (cache.has(src)) return ready(cache.get(src));
    loader.load(src, tex => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      cache.set(src, tex);
      ready(tex);
    }, undefined, () => container.classList.add('error'));
  }

  // Drag / swipe (vertical page scroll keeps working on touch: touch-action: pan-y)
  let px = 0, py = 0, pid = null;
  canvas.addEventListener('pointerdown', e => {
    pid = e.pointerId; px = e.clientX; py = e.clientY;
    state.dragging = true; state.auto = false; state.vyaw = 0;
    canvas.setPointerCapture(pid);
    container.classList.add('grabbing', 'touched');
  });
  canvas.addEventListener('pointermove', e => {
    if (!state.dragging || e.pointerId !== pid) return;
    const k = state.fov / container.clientHeight * (Math.PI / 180);
    const dx = (e.clientX - px) * k, dy = (e.clientY - py) * k;
    state.yaw += dx; state.vyaw = dx;
    if (e.pointerType === 'mouse') state.pitch = clamp(state.pitch + dy, -1.3, 1.3);
    px = e.clientX; py = e.clientY;
  });
  const up = () => { state.dragging = false; pid = null; idleAt = performance.now(); container.classList.remove('grabbing'); };
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('keydown', e => {
    const step = { ArrowLeft: [0.15, 0], ArrowRight: [-0.15, 0], ArrowUp: [0, 0.1], ArrowDown: [0, -0.1] }[e.key];
    if (!step) return;
    e.preventDefault();
    state.auto = false; state.yaw += step[0]; state.pitch = clamp(state.pitch + step[1], -1.3, 1.3);
    if (!running) renderOnce();
  });
  canvas.tabIndex = 0;

  function onOrient(e) {
    if (e.alpha == null) return;
    state.gyro = { a: THREE.MathUtils.degToRad(e.alpha), b: THREE.MathUtils.degToRad(e.beta) };
  }
  let gyroBase = null;
  async function enableGyro() {
    try {
      if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
        if ((await DeviceOrientationEvent.requestPermission()) !== 'granted') return false;
      }
      addEventListener('deviceorientation', onOrient);
      gyroBase = null; state.auto = false;
      return true;
    } catch { return false; }
  }
  function disableGyro() { removeEventListener('deviceorientation', onOrient); state.gyro = null; gyroBase = null; }

  const look = new THREE.Vector3();
  function step(t) {
    const dt = Math.min(0.05, (t - lastT) / 1000);
    lastT = t;
    if (!state.dragging) {
      state.yaw += state.vyaw; state.vyaw *= 0.92;
      if (state.auto || t - idleAt > 6000) state.yaw += dt * drift; // gentle drift when idle
    }
    let yaw = state.yaw + state.offset, pitch = state.pitch;
    if (state.gyro) {
      gyroBase ??= { a: state.gyro.a - state.yaw, b: state.gyro.b };
      yaw = state.gyro.a - gyroBase.a;
      pitch = clamp((state.gyro.b - Math.PI / 2) * 0.9, -1.3, 1.3);
    }
    if (state.fade < 1) {
      state.fade = Math.min(1, state.fade + dt * fadeSpeed);
      layers[front].material.opacity = state.fade;
      layers[1 - front].material.opacity = layers[1 - front].material.map ? 1 : 0;
      if (state.fade >= 1) layers[1 - front].material.opacity = 0;
    }
    camera.fov += (state.fov - camera.fov) * 0.15;
    camera.updateProjectionMatrix();
    look.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
    camera.lookAt(look);
    renderer.render(scene, camera);
  }
  function frame(t) { step(t); if (running) raf = requestAnimationFrame(frame); }
  function renderOnce() { step(performance.now()); }

  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    state.fov = clamp(state.fov, 35, w < h ? 95 : 85);
    camera.updateProjectionMatrix();
    renderOnce();
  }
  new ResizeObserver(resize).observe(container);
  resize();

  return {
    load,
    zoom(dir) { state.fov = clamp(state.fov + dir * 12, 35, container.clientWidth < container.clientHeight ? 95 : 85); state.auto = false; if (!running) renderOnce(); },
    setOffset(rad) { state.offset = rad; if (!running) renderOnce(); },
    enableGyro, disableGyro,
    start() { if (!running) { running = true; lastT = performance.now(); raf = requestAnimationFrame(frame); } },
    stop() { running = false; cancelAnimationFrame(raf); },
    dispose() { this.stop(); disableGyro(); renderer.dispose(); canvas.remove(); }
  };
}
