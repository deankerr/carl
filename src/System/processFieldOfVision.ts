import * as ROT from 'rot-js'
import { Engine } from '../Core/Engine'
import { logger } from '../lib/logger'

import { point, Point } from '../Model/Point'

export const processFieldOfVision = (engine: Engine) => {
  const log = logger('sys', 'turn', 'processFieldOfVision')
  // *** currently updating all entities' fov each turn ***
  const { local } = engine
  const entities = local.get('fieldOfView', 'position')
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
    local.entity(entity).modify('fieldOfView', entity.fieldOfView.radius, visible)

    // player specific
    if (entity.playerControlled) {
      // update level memory
      const revealed = new Set<Point>([...local.seenByPlayer, ...visible])
      local.seenByPlayer = revealed
    }
  }

  log.end()
}
