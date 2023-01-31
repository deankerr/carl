import * as ROT from 'rot-js'
import { Color } from 'rot-js/lib/color'
import { Engine } from '../Core/Engine'
// import { transformHSL } from '../lib/color'
import { point } from '../Model/Point'

export const processLighting = (engine: Engine) => {
  const { local } = engine
  const emitters = local.get('emitLight', 'position')
  if (emitters.length === 0) return

  const lightPathUpdate = local.get('signalLightPathUpdated')
  // const animatorUpdate = emitters.some(e => {
  //   return e.emitLight.frequency && Date.now() - e.emitLight.lastUpdate >= e.emitLight.frequency
  // })

  // skip update if:
  // - lighting has been calculated and light blockers haven't changed, or
  // - there are no light emitting animators who need updating
  // if (local.active.lighting.size > 0 && lightPathUpdate.length === 0 && !animatorUpdate) return
  if (local.lighting.size > 0 && lightPathUpdate.length === 0) return
  // const t = Date.now()
  console.log('processLighting')

  // set up infrastructure for ROT.JS lighting
  const fov = new ROT.FOV.PreciseShadowcasting(local.ROTisTransparent.bind(local))
  const lighting = new ROT.Lighting((x: number, y: number) =>
    // 'blocksLight' in local.active.terrain(Pt(x, y)) ? 0.3 : 0
    local.terrainAt(point(x, y)) ? 0.3 : 0
  )
  lighting.setFOV(fov)

  // set the light points and colors for each emitter
  for (const emitter of emitters) {
    const { position } = emitter
    // const { color, frequency, current, lastUpdate } = emitter.emitLight

    // process animators if necessary
    // let lightColor = color
    // if (frequency && Date.now() - lastUpdate >= frequency) {
    //   if (current) {
    //     lightColor = transformHSL(color, { lum: { by: 0.9, min: 0 } })
    //   }
    //   local.modify(emitter).noLog().change(emitLight(color, frequency, !current, Date.now()))
    // }

    lighting.setLight(position.x, position.y, emitter.emitLight)
  }

  const lightingCallback = (x: number, y: number, color: Color) => {
    local.lighting.set(point(x, y), color)
  }
  lighting.compute(lightingCallback)

  // remove update tag from entities if any
  lightPathUpdate.forEach(e => local.entity(e).remove('signalLightPathUpdated'))
  local.hasChanged = true
  // console.log(`processLighting complete ${Date.now() - t}ms`)
}

// enhanced mode
// const lighting = new ROT.Lighting(reflectivity, { range: 12, passes: 2 })
