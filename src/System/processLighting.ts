import * as ROT from 'rot-js'
import { Color } from 'rot-js/lib/color'
import { World } from '../Core/World'
import { Pt } from '../Model/Point'

export const processLighting = (world: World) => {
  const entitylightingUpdate = world.get('tagLightPathUpdated')
  if (entitylightingUpdate.length === 0 && world.active.lighting.size > 0) return
  const t = Date.now()

  // create Map if it does not yet exist (initial)
  world.active.lighting = new Map<string, Color>()

  const emitters = world.get('emitLight', 'position')
  if (emitters.length === 0) return

  console.log('processLighting')
  const fov = new ROT.FOV.PreciseShadowcasting(world.isTransparent.bind(world))

  // doesn't seem to get called without {passes: 2}
  const reflectivity = (x: number, y: number) => {
    return 'blocksLight' in world.active.terrain(Pt(x, y)) ? 0.3 : 0
  }

  // const lighting = new ROT.Lighting(reflectivity, { range: 12, passes: 2 })
  const lighting = new ROT.Lighting(reflectivity)
  lighting.setFOV(fov)
  // lighting.setLight(10, 8, [100, 0, 200])
  // lighting.setLight(25, 8, [240, 60, 60])
  // lighting.setLight(40, 15, [50, 200, 50])

  for (const { emitLight, position } of emitters) {
    lighting.setLight(position.x, position.y, emitLight.color)
  }

  const lightingCallback = (x: number, y: number, color: Color) => {
    world.active.lighting.set(x + ',' + y, color)
  }
  lighting.compute(lightingCallback)

  // remove update tag from entities if any
  entitylightingUpdate.forEach(e => world.modify(e).remove('tagLightPathUpdated'))

  console.log(`processLighting complete ${Date.now() - t}ms`)
}
