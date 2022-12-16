import * as ROT from 'rot-js'
import { FOV, Position } from '../components'
import { Entity } from '../entity'
import { Level } from '../Level'

export function UpdateFOV(entity: Entity, level: Level) {
  if (!entity.has(FOV) || !entity.has(Position)) {
    return
  }
  const fov = entity.get(FOV)
  const pos = entity.get(Position)
  const visible: { [key: string]: boolean } = {}
  const fovFunction = new ROT.FOV.RecursiveShadowcasting(level.isTransparent)
  // const fovFunction = new ROT.FOV.PreciseShadowcasting(level.isTransparent)

  fovFunction.compute(pos.x, pos.y, fov.radius, (x, y, _r, isVisible) => {
    if (isVisible) {
      visible[`${x}-${y}`] = true
      level.see(x, y)
    } else {
      visible[`${x}-${y}`] = false
    }
  })

  fov.visible = visible
}
