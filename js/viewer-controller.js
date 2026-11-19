import { MAX_FILE_BYTES, readModelFiles, prepareModel } from './model-input.js';

export function createModelPreview(viewer, media, title, detail) {
  let current = null;
  let version = 0;
  const close = () => {
    version++;
    current?.dispose();
    current = null;
  };
  async function open(doc, name, description) {
    // _gltf/_obj payloads are already binary-ready — prepareModel is the bbmodel validator
    if (doc?._gltf == null && doc?._obj == null) doc = prepareModel(doc);
    close();
    const request = version;
    title.textContent = name;
    detail.textContent = description;
    media.innerHTML = `<div class="render-shell">
      <div class="render-canvas" aria-busy="true"></div>
      <p class="render-status" role="status">Preparing 3D renderer...</p>
      <div class="render-tools" role="group" aria-label="3D model controls" hidden>
        <label>Animation <select class="clip-select"><option value="">Rest pose</option></select></label>
        <button data-tool="play" aria-pressed="true">Pause animation</button>
      </div>
      <details class="render-warnings" hidden><summary>Model compatibility notes</summary><ul></ul></details>
    </div>`;
    if (!viewer.open) viewer.showModal();
    document.body.classList.add('viewer-open');
    const host = media.querySelector('.render-canvas');
    const status = media.querySelector('.render-status');
    const tools = media.querySelector('.render-tools');
    try {
      const { mountViewer } = await import('../vendor/model-viewer.js');
      if (request !== version) return;
      const instance = await mountViewer(host, doc);
      if (request !== version) { instance.dispose(); return; }
      current = instance;
      host.setAttribute('aria-busy', 'false');
      status.textContent = 'Drag to orbit. Scroll or pinch to zoom. Right-drag or two fingers to pan.' +
        (instance.warnings.length ? ` ${instance.warnings.length} compatibility note${instance.warnings.length > 1 ? 's' : ''} below — some parts may not have imported.` : '');
      host.addEventListener('viewer-error', e => { status.textContent = e.detail; status.classList.add('is-error'); });
      // animation controls only earn the space when the model actually has clips
      if (instance.animations.length) {
        tools.hidden = false;
        const clips = tools.querySelector('select');
        instance.animations.forEach(name => clips.add(new Option(name, name)));
        clips.addEventListener('change', () => instance.setAnimation(clips.value));
        const play = tools.querySelector('[data-tool="play"]');
        play.addEventListener('click', () => {
          const value = play.getAttribute('aria-pressed') !== 'true';
          instance.setPlaying(value);
          play.setAttribute('aria-pressed', String(value));
          play.textContent = value ? 'Pause animation' : 'Play animation';
        });
      }
      if (instance.warnings.length) {
        const warnings = media.querySelector('.render-warnings');
        warnings.hidden = false;
        warnings.querySelector('ul').replaceChildren(...instance.warnings.map(text => {
          const li = document.createElement('li');
          li.textContent = text;
          return li;
        }));
      }
    } catch (error) {
      if (request !== version) return;
      status.textContent = error.message || 'The renderer could not start. Close this preview and try again.';
      status.classList.add('is-error');
      host.setAttribute('aria-busy', 'false');
    }
  }

  async function openFiles(files) {
    const model = await readModelFiles(files);
    await open(model.document, model.name, 'Local Blockbench project / Nothing uploaded or saved to the gallery.');
  }
  async function openCatalog(entry, name) {
    const urls = [entry.url, ...(entry.textures || [])];
    const files = [];
    for (const path of urls) {
      const url = new URL(path, location.href);
      if (url.origin !== location.origin) throw new Error('Gallery models and textures must be hosted on this website.');
      const response = await fetch(url);
      if (!response.ok) throw new Error(`The model or texture file is unavailable (${response.status}).`);
      if (Number(response.headers.get('content-length')) > MAX_FILE_BYTES) throw new Error('The model or texture is larger than 20 MB.');
      const blob = await response.blob();
      files.push(new File([blob], decodeURIComponent(url.pathname.split('/').pop()), { type: blob.type }));
    }
    const model = await readModelFiles(files);
    if (entry.anim && model.document._obj) model.document._obj.anim = entry.anim;
    await open(model.document, name, 'Interactive Blockbench model / Drag to explore.');
  }
  return { open, openFiles, openCatalog, close };
}
