// Keys match the names in the gallery. OBJ entries carry their mtl +
// texture pngs as companions; add anim data if a model has frame strips.
export const modelFiles = {
  'Shockwave': {
    url: 'models/shockwave/shockwave.obj',
    textures: ['models/shockwave/shockwave.mtl', 'models/shockwave/shockwave.png'],
  },
  'Afterburner': {
    url: 'models/afterburner/afterburner.obj',
    textures: ['models/afterburner/afterburner.mtl', 'models/afterburner/afterburner.png'],
  },
  'Lifestealer': {
    url: 'models/lifestealer/lifestealer.obj',
    textures: ['models/lifestealer/lifestealer.mtl', 'models/lifestealer/texture.png',
      'models/lifestealer/texture1.png', 'models/lifestealer/texture2.png'],
  },
  'Primal Spear': {
    url: 'models/primal_spear/Primal_spear.obj',
    textures: ['models/primal_spear/Primal_spear.mtl', 'models/primal_spear/blade.png',
      'models/primal_spear/handel.png', 'models/primal_spear/vines.png'],
  },
  'Void Hammer': {
    url: 'models/void_hammer/void_hammer.obj',
    textures: ['models/void_hammer/void_hammer.mtl', 'models/void_hammer/void_hammer.png'],
  },
  'Warden Axe': {
    url: 'models/warden_axe/Warden_axe.obj',
    textures: ['models/warden_axe/Warden_axe.mtl', 'models/warden_axe/warden_axe.png'],
  },
  // stars.png + animated_lines.png are frame strips — animSource keeps the
  // bbmodel around so frame counts can be rebuilt (same trick as the hero)
  'Nyxfall': {
    url: 'models/nyxfall/Nyxfall.obj',
    textures: ['models/nyxfall/Nyxfall.mtl', 'models/nyxfall/handel.png',
      'models/nyxfall/animated_lines.png', 'models/nyxfall/blades.png', 'models/nyxfall/stars.png'],
    animSource: 'models/nyxfall/Nyxfall.bbmodel',
  },
  'Frost Blade': {
    url: 'models/frost_blade/frostblade.obj',
    textures: ['models/frost_blade/frostblade.mtl', 'models/frost_blade/handle.png',
      'models/frost_blade/guard.png', 'models/frost_blade/blade.png', 'models/frost_blade/signature.png'],
  },
  'Void Spear': {
    url: 'models/void_spear/void_spear.obj',
    textures: ['models/void_spear/void_spear.mtl', 'models/void_spear/spear.png'],
  },
  'Crown': {
    url: 'models/crown/crown.obj',
    textures: ['models/crown/crown.mtl', 'models/crown/crown.png', 'models/crown/jewels.png'],
  },
  'Electric Trident': {
    url: 'models/electric_trident/electric_trident.obj',
    textures: ['models/electric_trident/electric_trident.mtl',
      'models/electric_trident/electric.png', 'models/electric_trident/outline.png'],
  },
  'Nautilus Longsword': {
    url: 'models/nautilus/Nautilus Longsword.obj',
    textures: ['models/nautilus/Nautilus Longsword.mtl', 'models/nautilus/nautilus.png',
      'models/nautilus/layer2 parts.png', 'models/nautilus/blade layer 2.png', 'models/nautilus/layer3.png'],
  },
  'Ghost': {
    url: 'models/ghost/ghost.obj',
    textures: ['models/ghost/ghost.mtl', 'models/ghost/ghosty.png', 'models/ghost/layer.png'],
  },
  'Blood Pedestal': {
    url: 'models/blood_pedestal/blood pedestal.obj',
    textures: ['models/blood_pedestal/blood pedestal.mtl', 'models/blood_pedestal/blood altar.png',
      'models/blood_pedestal/blood_texture.png', 'models/blood_pedestal/chains.png',
      'models/blood_pedestal/blood 1.png', 'models/blood_pedestal/blood stain.png',
      'models/blood_pedestal/more blood.png'],
    animSource: 'models/blood_pedestal/blood pedestal.bbmodel',
  },
  'Gothic Pedestal': {
    url: 'models/gothic_pedestal/gothic-pedestal-legacy.obj',
    textures: ['models/gothic_pedestal/gothic-pedestal-legacy.mtl', 'models/gothic_pedestal/goths.png',
      'models/gothic_pedestal/rubes.png', 'models/gothic_pedestal/stripes.png'],
    animSource: 'models/gothic_pedestal/gothic-pedestal-legacy.bbmodel',
  },
  'Heavenly Pedestal': {
    url: 'models/heavenly_pedestal/havenly_pedestal.obj',
    textures: ['models/heavenly_pedestal/havenly_pedestal.mtl',
      'models/heavenly_pedestal/heaven_holy_white_gold.png'],
  },
  'Magma Pike': {
    url: 'models/magma_pike/MAGMA_PIKE.obj',
    textures: ['models/magma_pike/MAGMA_PIKE.mtl', 'models/magma_pike/blade.png',
      'models/magma_pike/blade layer.png', 'models/magma_pike/hook layer.png',
      'models/magma_pike/lower_hook.png', 'models/magma_pike/rod.png'],
  },
  'Canopy Reaver': {
    url: 'models/canopy_reaver/Canopy_Reaver.obj',
    textures: ['models/canopy_reaver/Canopy_Reaver.mtl', 'models/canopy_reaver/blade_dark_moss.png',
      'models/canopy_reaver/blade_layer.png', 'models/canopy_reaver/handle.png', 'models/canopy_reaver/stripes.png'],
    animSource: 'models/canopy_reaver/Canopy_Reaver.bbmodel',
  },
  'Glacier Maul': {
    url: 'models/glacier_maul/Glacier Maul.obj',
    textures: ['models/glacier_maul/Glacier Maul.mtl', 'models/glacier_maul/glacier.png'],
  },
  'Voidedge': {
    url: 'models/voidedge/voidedge.obj',
    textures: ['models/voidedge/voidedge.mtl', 'models/voidedge/animated.png',
      'models/voidedge/blade.png', 'models/voidedge/guard.png', 'models/voidedge/lower_hook.png'],
    animSource: 'models/voidedge/voidedge.bbmodel',
  },
  'Voidfang': {
    url: 'models/voidfang/Voidfang.obj',
    textures: ['models/voidfang/Voidfang.mtl', 'models/voidfang/Handel.png',
      'models/voidfang/core.png', 'models/voidfang/blade.png',
      'models/voidfang/blade_outer_layer.png', 'models/voidfang/Blade_inner_shade.png',
      'models/voidfang/animated.png'],
    animSource: 'models/voidfang/Voidfang.bbmodel',
  },
  'Midus Mase': {
    url: 'models/midus_mase/midus_mase.obj',
    textures: ['models/midus_mase/midus_mase.mtl', 'models/midus_mase/midus.png',
      'models/midus_mase/electric.png', 'models/midus_mase/spining cube.png'],
    animSource: 'models/midus_mase/midus_mase.bbmodel',
  },
  'Sculk Blade': {
    url: 'models/sculk_blade_new/sculk_blade.obj',
    textures: ['models/sculk_blade_new/sculk_blade.mtl', 'models/sculk_blade_new/hook.png',
      'models/sculk_blade_new/handel.png', 'models/sculk_blade_new/1.png',
      'models/sculk_blade_new/blade.png', 'models/sculk_blade_new/inner_blade.png',
      'models/sculk_blade_new/layer.png', 'models/sculk_blade_new/animated1.png'],
    animSource: 'models/sculk_blade_new/sculk_blade.bbmodel',
  },
};
