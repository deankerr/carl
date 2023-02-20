import * as ROT from 'rot-js'
import { Engine } from '../Core/Engine'

import { point, Point } from '../lib/Shape/Point'

export const processFieldOfVision = (engine: Engine) => {
  const { local } = engine

  const entities = local
    .get('fieldOfView', 'position')
    .filter(e => 'acting' in e || 'signalUpdatePlayerFOV' in e)

  if (!entities) return

  for (const entity of entities) {
    const fovFunction = new ROT.FOV.RecursiveShadowcasting(local.ROTisTransparent.bind(local))

    const visible = new Set<Point>()
    fovFunction.compute(
      entity.position.x,
      entity.position.y,
      entity.fieldOfView.radius,
      (x, y, _r, isVisible) => {
        if (isVisible) visible.add(point(x, y))
      }
    )
    local
      .modify(entity)
      .define('fieldOfView', entity.fieldOfView.radius, visible)
      .remove('signalUpdatePlayerFOV')

    // player specific
    if (entity.playerControlled) {
      // update level memory
      local.areaVisible.clear()
      for (const pt of visible) {
        local.areaKnown.set(pt, true)
        local.areaVisible.set(pt, true)
      }
    }
  }
}
