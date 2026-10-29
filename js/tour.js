/* ===================================================
   HOTEL YOUCEF · tour.js — 360° tour UI around pano.js
   <div data-tour [data-scroll] [data-initial="room"]> … </div>
   =================================================== */
import { createPano } from './pano.js';

export function mountTour(el, initial = el.dataset.initial || PANOS[0].id) {
  const scenes = el.querySelector('.tour-scenes');
  const title = el.querySelector('.tour-title');
  const viewer = createPano(el, {
    onLoad: p => {
      scenes?.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pano === p.id)));
      if (title) title.textContent = p.title;
    }
  });

  if (scenes) {
    scenes.innerHTML = PANOS.map(p => `<button type="button" data-pano="${p.id}" aria-pressed="false"><i data-lucide="${p.icon || 'scan'}"></i>${p.title}</button>`).join('');
    scenes.addEventListener('click', e => {
      const b = e.target.closest('[data-pano]');
      if (b) viewer.load(PANOS.find(p => p.id === b.dataset.pano));
    });
  }
  el.querySelector('[data-zoom="in"]')?.addEventListener('click', () => viewer.zoom(-1));
  el.querySelector('[data-zoom="out"]')?.addEventListener('click', () => viewer.zoom(1));

  const gyroBtn = el.querySelector('[data-gyro]');
  if (gyroBtn) {
    if (!('DeviceOrientationEvent' in window) || !matchMedia('(pointer: coarse)').matches) gyroBtn.hidden = true;
    gyroBtn.addEventListener('click', async () => {
      const on = gyroBtn.getAttribute('aria-pressed') === 'true';
      if (on) { viewer.disableGyro(); gyroBtn.setAttribute('aria-pressed', 'false'); return; }
      gyroBtn.setAttribute('aria-pressed', String(await viewer.enableGyro()));
    });
  }
  el.querySelector('[data-full]')?.addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.().catch(() => {});
  });

  // Scroll turns the view a little as the section passes by
  if (el.hasAttribute('data-scroll') && window.ScrollTrigger && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ScrollTrigger.create({
      trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true,
      onUpdate: s => viewer.setOffset(-s.progress * Math.PI * 0.5)
    });
  }

  new IntersectionObserver(([e]) => {
    document.documentElement.classList.toggle('in-tour', e.isIntersecting && e.intersectionRatio > 0.4);
    e.isIntersecting ? viewer.start() : viewer.stop();
  }, { threshold: [0, 0.4] }).observe(el);
  viewer.load(PANOS.find(p => p.id === initial) || PANOS[0]);
  window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  return viewer;
}

// Auto-mount inline tours; modal tours are mounted on demand by the page script
document.querySelectorAll('[data-tour]:not([data-lazy])').forEach(el => {
  try { mountTour(el); } catch (err) { console.warn('360 viewer unavailable', err); el.classList.add('error'); }
});
window.mountTour = mountTour;
