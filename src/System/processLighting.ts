import * as ROT from 'rot-js'
import { Color } from 'rot-js/lib/color'
import { Engine } from '../Core/Engine'
// import { transformHSL } from '../lib/color'
import { logger } from '../lib/logger'
import { point } from '../Model/Point'

export const processLighting = (engine: Engine) => {
  const { local, options } = engine
  if (!options.lightingUpdate) return

  const lightPathUpdate = local.get('signalLightPathUpdated')

  if (lightPathUpdate.length === 0) return
  const log = logger('sys', 'processLighting')

  const emitters = local.get('emitLight', 'position')

  // TODO store this data instead of throwing it away when more light effects are added
  // set up infrastructure for ROT.JS lighting
  const fov = new ROT.FOV.PreciseShadowcasting(local.ROTisTransparent.bind(local))
  const lighting = new ROT.Lighting((x: number, y: number) => 0) // dummy callback, not actually used
  lighting.setFOV(fov)

  // set the light points and colors for each emitter
  for (const emitter of emitters) {
    if (!emitter.emitLight.enabled) continue
    const { position, emitLight } = emitter

    //lightColor = transformHSL(emitLight.color, { lum: { by: 0.85, min: 0 } })
    lighting.setLight(position.x, position.y, emitLight.color)
  }

  // // clear previous lighting data
  // local.lighting.clear()

  const lightingCallback = (x: number, y: number, color: Color) => {
    local.lighting.set(point(x, y), color)
  }
  lighting.compute(lightingCallback)

  // remove update tag from entities
  local.get('signalLightPathUpdated').forEach(e => local.entity(e).remove('signalLightPathUpdated'))
  local.hasChanged = true
  log.end('lighting updated')
}

// enhanced mode
// const lighting = new ROT.Lighting(reflectivity, { range: 12, passes: 2 })
