export const MAX_FILE_BYTES = 20 * 1024 * 1024;
const imageData = /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=\r\n]+$/i;
const basename = path => String(path || '').replaceAll('\\', '/').split('/').pop().toLowerCase();

export function prepareModel(input, textures = new Map()) {
  let doc;
  try { doc = typeof input === 'string' ? JSON.parse(input) : structuredClone(input); }
  catch { throw new Error('This file is not valid JSON. Save the project as a .bbmodel in Blockbench and try again.'); }
  if (!doc?.meta?.format_version || !Array.isArray(doc.elements) || !doc.elements.length) {
    throw new Error('No Blockbench model geometry found. Use File > Save Project in Blockbench, not a Minecraft JSON export.');
  }
  const major = Number.parseInt(doc.meta.format_version, 10);
  if (major !== 4 && major !== 5) throw new Error('This preview supports Blockbench project versions 4 and 5. Re-save it in a current Blockbench version.');
  if (doc.elements.length > 5000) throw new Error('This model is too large for this preview (5,000 elements maximum).');

  // Bound the parsed input before handing nested hierarchies to the loader.
  const stack = [[doc, 0]];
  let nodes = 0;
  while (stack.length) {
    const [value, depth] = stack.pop();
    if (++nodes > 300000 || depth > 100) throw new Error('This project is too complex for the browser preview.');
    if (value && typeof value === 'object') {
      for (const child of Object.values(value)) stack.push([child, depth + 1]);
    } else if (typeof value === 'number' && !Number.isFinite(value)) {
      throw new Error('The project contains invalid numeric coordinates.');
    }
  }
  // v4 keeps group metadata inline in the outliner; the loader expects v5's separate group list.
  const groups = new Map((doc.groups || []).map(group => [group.uuid, group]));
  const pending = [...(doc.outliner || [])];
  while (pending.length) {
    const node = pending.pop();
    if (node && typeof node === 'object') {
      if (!groups.has(node.uuid)) groups.set(node.uuid, { ...node });
      pending.push(...(node.children || []));
    }
  }
  doc.groups = [...groups.values()];
  for (const el of doc.elements) {
    // locators are attachment markers with no geometry — the loader warns
    // and skips them, no reason to fail the whole file.
    if (!el || !['cube', 'mesh', 'locator'].includes(el.type || 'cube')) {
      throw new Error(`Unsupported element type: ${el?.type || 'unknown'}. This viewer currently supports cubes and meshes.`);
    }
  }
  for (const clip of doc.animations || []) {
    if (!Number.isFinite(clip.length) || clip.length < 0 || clip.length > 120) {
      throw new Error('Animation clips must be between 0 and 120 seconds long.');
    }
  }
  if ((doc.animations?.length || 0) > 100) throw new Error('This preview supports up to 100 animation clips.');
  if ((doc.textures?.length || 0) > 64) throw new Error('This preview supports up to 64 textures.');

  for (const tex of doc.textures || []) {
    if (!tex || typeof tex !== 'object') throw new Error('The project contains an invalid texture entry.');
    const name = tex.name || basename(tex.path || tex.relative_path) || 'unnamed texture';
    if ((tex.width || 0) > 8192 || (tex.height || 0) > 8192) throw new Error('Texture dimensions must not exceed 8192 pixels.');
    const layers = tex.layers_enabled && Array.isArray(tex.layers) ? tex.layers.filter(l => l.visible !== false) : [];
    if (layers.length) {
      for (const layer of layers) {
        if (!imageData.test(layer.data_url || '')) throw new Error(`Embed the layers for "${name}" in Blockbench before opening it here.`);
      }
    } else if (!imageData.test(tex.source || '')) {
      const candidates = [tex.name, tex.relative_path, tex.path, tex.source].map(basename);
      const source = candidates.map(key => textures.get(key)).find(Boolean);
      if (!source || !imageData.test(source)) {
        throw new Error(`Missing texture "${name}". Select its PNG/JPG/WebP alongside the .bbmodel, or embed textures in Blockbench.`);
      }
      tex.source = source;
    }
    // Imported projects may contain local disk paths or remote URLs. Never follow them.
    delete tex.path;
    delete tex.relative_path;
    if (layers.length) delete tex.source;
  }
  return doc;
}

export async function readModelFiles(files) {
  const list = [...files];
  const gltfs = list.filter(f => /\.glb$|\.gltf$/i.test(f.name));
  if (gltfs.length) {
    if (gltfs.length !== 1 || list.length !== 1) throw new Error('A .glb/.gltf embeds everything — select it on its own.');
    const f = gltfs[0];
    if (f.size > MAX_FILE_BYTES) throw new Error('Choose a model file under 20 MB.');
    const doc = /\.glb$/i.test(f.name)
      ? { _gltf: await f.arrayBuffer() }
      : { _gltf: await f.text() };
    if (doc._gltf instanceof ArrayBuffer && (doc._gltf.byteLength < 20 || new DataView(doc._gltf).getUint32(0) !== 0x46546c67)) {
      throw new Error('This file is not a valid .glb — export it from Blockbench with File > Export > glTF.');
    }
    return { name: f.name.replace(/\.glb$|\.gltf$/i, ''), document: doc };
  }
  const objs = list.filter(f => /\.obj$/i.test(f.name));
  if (objs.length) {
    if (objs.length !== 1) throw new Error('Select exactly one .obj, its .mtl, and the texture files it references.');
    const f = objs[0];
    if (list.some(x => x.size > MAX_FILE_BYTES)) throw new Error('Choose files under 20 MB each.');
    const mtlFile = list.find(x => /\.mtl$/i.test(x.name));
    const textures = new Map();
    for (const file of list.filter(x => x !== f && x !== mtlFile)) {
      if (!/\.(png|jpe?g|webp)$/i.test(file.name)) throw new Error('Texture files must be PNG, JPG, or WebP.');
      textures.set(basename(file.name), URL.createObjectURL(file));
    }
    return { name: f.name.replace(/\.obj$/i, ''), document: { _obj: { obj: await f.text(), mtl: mtlFile ? await mtlFile.text() : '', textures } } };
  }
  const projects = list.filter(f => f.name.toLowerCase().endsWith('.bbmodel'));
  if (projects.length !== 1) throw new Error('Select exactly one .bbmodel, .glb, .gltf, or .obj file, plus its textures if needed.');
  if (list.some(f => f.size > MAX_FILE_BYTES) || list.reduce((n, f) => n + f.size, 0) > 80 * 1024 * 1024) {
    throw new Error('Choose files under 20 MB each and 80 MB total.');
  }
  const textures = new Map();
  for (const file of list.filter(f => f !== projects[0])) {
    if (!/\.(png|jpe?g|webp)$/i.test(file.name)) throw new Error('Texture files must be PNG, JPG, or WebP.');
    const name = basename(file.name);
    if (textures.has(name)) throw new Error(`Two textures have the same filename "${file.name}". Rename them in Blockbench first.`);
    const source = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error(`Could not read "${file.name}". Select it again.`));
      reader.readAsDataURL(file);
    });
    textures.set(name, source);
  }
  return { name: projects[0].name.replace(/\.bbmodel$/i, ''), document: prepareModel(await projects[0].text(), textures) };
}
