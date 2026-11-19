import { profile } from './profile.js';
import { modelFiles } from './model-manifest.js';
import { createModelPreview } from './viewer-controller.js';

// Gallery entries — name shows under the tile, file is the thumb in
// assets/models/, type is one of the filter keys below.
const models = [
  { name: 'Shockwave', file: 'thumbs/shockwave.webp', type: 'mace' },
  { name: 'Afterburner', file: 'thumbs/afterburner.webp', type: 'sword' },
  { name: 'Lifestealer', file: 'thumbs/lifestealer.webp', type: 'sword' },
  { name: 'Primal Spear', file: 'thumbs/primal_spear.webp', type: 'others' },
  { name: 'Void Hammer', file: 'thumbs/void_hammer.webp', type: 'mace' },
  { name: 'Warden Axe', file: 'thumbs/warden_axe.webp', type: 'others' },
  { name: 'Nyxfall', file: 'thumbs/nyxfall.webp', type: 'sword' },
  { name: 'Frost Blade', file: 'thumbs/frost_blade.webp', type: 'sword' },
  { name: 'Void Spear', file: 'thumbs/void_spear.webp', type: 'others' },
  { name: 'Crown', file: 'thumbs/crown.webp', type: 'others' },
  { name: 'Electric Trident', file: 'thumbs/electric_trident.webp', type: 'others' },
  { name: 'Nautilus Longsword', file: 'thumbs/nautilus.webp', type: 'sword' },
  { name: 'Ghost', file: 'thumbs/ghost.webp', type: 'entity' },
  { name: 'Blood Pedestal', file: 'thumbs/blood_pedestal.webp', type: 'pedestal' },
  { name: 'Gothic Pedestal', file: 'thumbs/gothic_pedestal.webp', type: 'pedestal' },
  { name: 'Heavenly Pedestal', file: 'thumbs/heavenly_pedestal.webp', type: 'pedestal' },
  { name: 'Magma Pike', file: 'thumbs/magma_pike.webp', type: 'others' },
  { name: 'Canopy Reaver', file: 'thumbs/canopy_reaver.webp', type: 'others' },
  { name: 'Glacier Maul', file: 'thumbs/glacier_maul.webp', type: 'mace' },
  { name: 'Voidedge', file: 'thumbs/voidedge.webp', type: 'sword' },
  { name: 'Voidfang', file: 'thumbs/voidfang.webp', type: 'sword' },
  { name: 'Midus Mase', file: 'thumbs/midus_mase.webp', type: 'mace' },
  { name: 'Sculk Blade', file: 'thumbs/sculk_blade.webp', type: 'sword' },
];
const labels = { sword: 'Sword', mace: 'Mace', entity: 'Entity', pedestal: 'Pedestal', others: 'Other' };
const gallery = document.getElementById('gallery');
const count = document.getElementById('gallery-count');
const more = document.getElementById('show-all');
let filter = 'all';
let expanded = false;

const viewer = document.getElementById('viewer');
const media = document.getElementById('viewer-media');
const viewerTitle = document.getElementById('viewer-title');
const detail = document.getElementById('viewer-detail');
const modelPreview = createModelPreview(viewer, media, viewerTitle, detail);
let dialogOpener = null;

async function inspect(model) {
  dialogOpener = document.activeElement;
  const entry = modelFiles[model.name];
  if (entry) {
    try {
      const anim = entry.animSource ? await animFor(entry.animSource) : undefined;
      await modelPreview.openCatalog({ ...entry, anim }, model.name);
      return;
    }
    catch { /* Fall back to the still preview below. */ }
  }
  const img = document.createElement('img');
  img.src = 'assets/models/' + model.file;
  img.alt = model.name + ' Minecraft model';
  media.replaceChildren(img);
  viewerTitle.textContent = model.name;
  detail.textContent = labels[model.type] + ' / GIF or image preview. Interactive 3D will replace this when the .bbmodel is added.';
  viewer.showModal();
  document.body.classList.add('viewer-open');
}

function renderGallery() {
  const matches = models.filter(m => filter === 'all' || m.type === filter);
  const visible = expanded ? matches : matches.slice(0, 6);
  gallery.replaceChildren(...visible.map(model => {
    const button = document.createElement('button');
    button.className = 'model';
    button.innerHTML = `<span class="model-image">
      <img src="assets/models/${model.file}" alt="" loading="lazy" width="400" height="308">
      <span class="model-format">${modelFiles[model.name] ? '3D' : 'Preview'}</span>
      <span class="model-open" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 17 17 7M7 7h10v10"/></svg></span>
      </span><span class="model-meta"><strong>${model.name}</strong><span>${labels[model.type]}</span></span>`;
    button.addEventListener('click', () => inspect(model));
    return button;
  }));
  if (!visible.length) {
    const empty = document.createElement('p');
    empty.className = 'gallery-empty';
    empty.textContent = models.length ? 'Nothing in this category yet.' : 'New models on the way.';
    gallery.append(empty);
  }
  document.querySelector('[data-filter="all"] span').textContent = models.length;
  count.textContent = `Showing ${visible.length} of ${matches.length}`;
  more.hidden = matches.length <= 6;
  more.innerHTML = expanded ? 'Show fewer models <span aria-hidden="true">&minus;</span>' : `View all ${matches.length} models <span aria-hidden="true">+</span>`;
  more.setAttribute('aria-expanded', String(expanded));
}

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    expanded = false;
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    renderGallery();
  });
});
more.addEventListener('click', () => {
  expanded = !expanded;
  renderGallery();
  if (!expanded) document.querySelector('.gallery-toolbar').scrollIntoView({ block: 'start' });
});
renderGallery();

document.getElementById('close-viewer').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', e => {
  // Only the backdrop should dismiss, not blank space inside the dialog.
  if (e.target !== viewer) return;
  const r = viewer.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) viewer.close();
});
viewer.addEventListener('close', () => {
  modelPreview.close();
  media.replaceChildren();
  document.body.classList.remove('viewer-open');
  dialogOpener?.focus();
  dialogOpener = null;
});



const audio = document.getElementById('music');
const musicButton = document.getElementById('music-toggle');
audio.volume = .3;
musicButton.addEventListener('click', async () => {
  if (!audio.paused) {
    audio.pause();
    return;
  }
  try {
    await audio.play();
  } catch {
    musicButton.querySelector('span').textContent = 'Music unavailable / Try again';
  }
});
audio.addEventListener('play', () => {
  musicButton.setAttribute('aria-pressed', 'true');
  musicButton.querySelector('span').textContent = 'Biting Bullets / Pause';
});
audio.addEventListener('pause', () => {
  musicButton.setAttribute('aria-pressed', 'false');
  musicButton.querySelector('span').textContent = 'Biting Bullets / Play';
});
audio.addEventListener('error', () => {
  musicButton.querySelector('span').textContent = 'Music unavailable / Try again';
});

// Live model in the hero; the poster stays if the load or WebGL fails.
const heroStage = document.querySelector('.hero-stage');
// same entry the catalog modal fetches — obj + mtl + every texture it names
const heroEntry = {
  url: 'models/hero/hero.obj',
  textures: ['hero.mtl', 'nyx-skin.png', 'Handel.png', 'core.png', 'blade11.png',
    'blade_outer_layer.png', 'Blade_inner_shade.png', 'animated.png', 'handle.png',
    'guard.png', '222.png', 'signature.png', 'lower_hook.png', 'hook layer.png',
    'rod.png', '22.png', 'blade layer.png'].map(f => 'models/hero/' + encodeURIComponent(f)),
};
// animated texture strips live in bbmodel metadata — the obj export
// loses it, so frame counts get rebuilt from the source bbmodel
const animMaps = {};
function animFor(url) {
  return animMaps[url] ??= (async () => {
    try {
      const d = await (await fetch(url)).json();
      const m = {};
      for (const t of d.textures || []) {
        const r = (t.width || 1) / (t.height || 1), u = (t.uv_width ?? t.width) / (t.uv_height ?? t.height);
        const fc = Math.max(1, Math.ceil(u / r - .05));
        if (fc > 1) m[String(t.name).toLowerCase()] = { fc, ft: t.frame_time || 1 };
      }
      return m;
    } catch { return {}; }
  })();
}
const heroAnim = animFor('models/hero.bbmodel');
async function openHero() {
  modelPreview.openCatalog({ ...heroEntry, anim: await heroAnim }, 'Skulls321').catch(() => {});
}
heroStage?.querySelector('.stage-expand').addEventListener('click', e => { e.stopPropagation(); openHero(); });
// click (not drag) on the stage opens the full viewer — orbit eats drags,
// taps under ~6px count as opens
let stageDown = null;
heroStage?.addEventListener('pointerdown', e => { stageDown = [e.clientX, e.clientY]; });
heroStage?.addEventListener('pointerup', e => {
  if (!stageDown) return;
  const moved = Math.hypot(e.clientX - stageDown[0], e.clientY - stageDown[1]);
  stageDown = null;
  if (moved < 6 && !e.target.closest('.stage-expand')) openHero();
});
heroStage?.addEventListener('keydown', e => { if (e.key === 'Enter') openHero(); });
(async () => {
  const host = heroStage?.querySelector('.hero-canvas');
  if (!host) return;
  try {
    const res = await fetch('models/hero/hero.obj');
    if (!res.ok) return;
    const mtl = await (await fetch('models/hero/hero.mtl')).text();
    const doc = { _obj: { obj: await res.text(), mtl, texPath: 'models/hero/', anim: await heroAnim } };
    const { mountViewer } = await import('../vendor/model-viewer.js');
    const inst = await mountViewer(host, doc, { zoom: false, pan: false, touchRotate: false });
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      inst.setAutoRotate(true);
      if (inst.animations?.includes('idle')) inst.setAnimation('idle');
    }
    inst.zoom(matchMedia('(max-width: 700px)').matches ? .55 : .85);
    heroStage.classList.add('is-live');
  } catch { heroStage.classList.add('is-poster'); }
})();

document.getElementById('year').textContent = new Date().getFullYear();
