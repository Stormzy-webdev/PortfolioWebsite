# Source models

Uncompressed Blender exports. These are **not** served; the compressed copies in
`public/models/` are what the site loads. After re-exporting a model, recompress it:

```sh
# chair / deskSetup / environment (use --texture-size 1024 for the chair)
npx @gltf-transform/cli optimize models-source/deskSetup.glb public/models/deskSetup.glb \
  --compress meshopt --texture-compress webp --texture-size 2048 \
  --flatten false --join false --instance false --palette false --simplify false

# monitors: textures only, NO geometry compression
npx @gltf-transform/cli optimize models-source/monitors.glb public/models/monitors.glb \
  --compress false --texture-compress webp --texture-size 1024 \
  --flatten false --join false --instance false --palette false --simplify false --weld false
```

- `--flatten/--join/--palette/... false` keep node, mesh and material names intact.
  `Monitors.jsx` looks up the `left-/right-monitor-frame/screen` nodes by name, and
  `DeskSetup.jsx` picks neon materials by name.
- Meshopt quantization adds a scale (~0.25) to each node. The monitor screen UIs are
  `<Html>` children of those nodes, so they would shrink with it. Keep monitors
  uncompressed.
