import * as ROT from 'rot-js'
import { Color } from 'rot-js/lib/color'
import { Engine } from '../Core/Engine'
import { transformHSL } from '../lib/color'
// import { transformHSL } from '../lib/color'
import { point } from '../Model/Point'

export const processLighting = (engine: Engine) => {
  const { local, options } = engine
  if (!options.lightingUpdate) return
  const emitters = local.get('emitLight', 'position')
  if (emitters.length === 0) return

  const lightPathUpdate = local.get('signalLightPathUpdated')

  const animators = local.get('emitLight', 'position', 'lightFlicker')
  const animatorUpdate = animators.some(e => {
    return (
      e.lightFlicker.frequency && Date.now() - e.lightFlicker.lastUpdate >= e.lightFlicker.frequency
    )
  })

  // skip update if:
  // - lighting has been calculated and light blockers haven't changed, or
  // - there are no light emitting animators who need updating
  if (local.lighting.size > 0 && lightPathUpdate.length === 0 && !animatorUpdate) return
  // const t = Date.now()
  // console.log('processLighting')

  // set up infrastructure for ROT.JS lighting
  const fov = new ROT.FOV.PreciseShadowcasting(local.ROTisTransparent.bind(local))
  const lighting = new ROT.Lighting((x: number, y: number) =>
    local.terrainAt(point(x, y)) ? 0.3 : 0
  )
  lighting.setFOV(fov)

  // set the light points and colors for each emitter
  for (const emitter of emitters) {
    if (!engine.options.playerLight && emitter === local.player()) continue

    const { position, emitLight } = emitter

    // process animators if necessary
    let lightColor = emitLight
    const flickerer = local.has(emitter, 'lightFlicker')
    if (flickerer) {
      const { frequency, lastUpdate, current } = flickerer.lightFlicker
      if (frequency && Date.now() - lastUpdate >= frequency) {
        if (current) {
          lightColor = transformHSL(emitLight, { lum: { by: 0.85, min: 0 } })
        }
        const hue = local.has(emitter, 'lightHueRotate')
        if (hue) {
          local
            .entity(hue)
            .modify(
              'emitLight',
              transformHSL(emitter.emitLight, { hue: { add: hue.lightHueRotate } })
            )
            .modify('lightFlicker', frequency, !current, Date.now())
        } else local.entity(flickerer).modify('lightFlicker', frequency, !current, Date.now())
      }
    }

    lighting.setLight(position.x, position.y, lightColor)
  }

  // clear previous lighting data
  local.lighting.clear()

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
