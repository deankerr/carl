import * as ROT from 'rot-js'
import { Color } from 'rot-js/lib/color'
import { World } from '../Core/World'
import { Pt } from '../Model/Point'

export const processLighting = (world: World) => {
  const t = Date.now()
  console.log('processLighting')
  const fov = new ROT.FOV.PreciseShadowcasting(world.isTransparent.bind(world))

  const reflectivity = (x: number, y: number) => {
    return world.active.terrain(Pt(x, y)).tagBlocksLight ? 0.3 : 0
  }

  const lighting = new ROT.Lighting(reflectivity, { range: 12, passes: 2 })
  // const lighting = new ROT.Lighting(reflectivity)
  lighting.setFOV(fov)
  lighting.setLight(10, 8, [100, 0, 200])
  lighting.setLight(25, 8, [240, 60, 60])
  lighting.setLight(40, 15, [50, 200, 50])

  const lightingCallback = (x: number, y: number, color: Color) => {
    world.active.lighting.set(x + ',' + y, color)
  }
  lighting.compute(lightingCallback)

  console.log(`processLighting complete ${Date.now() - t}ms`)
}
