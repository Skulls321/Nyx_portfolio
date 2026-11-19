# Adding Nyx's Real Models

Put each `.bbmodel` and any external PNG/JPG/WebP textures in this folder. Embedded textures are simplest. Keep the existing preview images as cheap thumbnails and fallbacks.

Add an entry to `../model-manifest.js`, using the exact gallery model name:

```javascript
export const modelFiles = {
  Nyxfall: {
    url: '/models/nyxfall.bbmodel',
    textures: ['/models/nyxfall.png'],
  },
  Soulbinder: {
    url: '/models/soulbinder.bbmodel',
    textures: [], // Embedded in this project.
  },
};
```

These are examples, not references to files currently supplied. Once a configured model is clicked, the dialog opens the actual model with orbit/zoom/pan controls. Gallery badges distinguish configured 3D items from image/GIF previews.

Local file selection in the test panel does not publish a model or change this manifest. Native `.bbmodel` compatibility is not identical to Blockbench itself; send the projects and textures so we can verify their pivots, UVs, transparency, and clips before replacing their previews.
