import * as ROT from 'rot-js'
import { Engine } from '../Core/Engine'

import { point, Point } from '../Model/Point'

export const processFieldOfVision = (engine: Engine) => {
  // *** currently updating all entities' fov each turn ***
  const { local } = engine
  const entities = local.get('fieldOfView', 'position')
  if (!entities) return

  for (const entity of entities) {
    const fovFunction = new ROT.FOV.RecursiveShadowcasting(local.ROTisTransparent.bind(local))

    const visible = new Set<Point>()
    fovFunction.compute(entity.position.x, entity.position.y, entity.fieldOfView.radius, (x, y, _r, isVisible) => {
      if (isVisible) visible.add(point(x, y))
    })
    local.entity(entity).modify('fieldOfView', entity.fieldOfView.radius, visible)

    // player specific
    if (entity.playerControlled) {
      // update level memory
      const revealed = new Set<Point>([...local.revealed, ...visible])
      local.revealed = revealed

      // see through everything to reveal void decor
      // const voidFunction = new ROT.FOV.RecursiveShadowcasting(() => true)
      // const newVoidPts: string[] = []
      // voidFunction.compute(entity.position.x, entity.position.y, entity.fov.radius, (x, y, _r, isVisible) => {
      //   if (isVisible) newVoidPts.push(Pt(x, y).s)
      // })
      // const voidSet = new Set<string>([...world.active.voidAreaKnown, ...newVoidPts])
      // world.active.voidAreaKnown = [...voidSet]
    }
  }

  console.log('processFOV: done')
}
