import { World } from '../World'
import { fov, seen } from '../Components'
import { PtS } from '../Core/Point'
import * as ROT from 'rot-js'

export function UpdateFOV(world: World) {
  // ! currently updating all entities' fov each turn
  const entities = world.get('fov', 'position')
  if (!entities) return

  for (const entity of entities) {
    console.log('UpdateFOV', entity.id)

    const level = world.current.level
    const fovFunction = new ROT.FOV.RecursiveShadowcasting(level.isTransparent.bind(level))

    const newFOV = fov(entity.fov.radius)
    fovFunction.compute(entity.position.x, entity.position.y, entity.fov.radius, (x, y, _r, isVisible) => {
      if (isVisible) newFOV.fov.visible.push(PtS(x, y))
    })

    const uEntity = world.updateComponent(entity, newFOV)

    // update seen if needed
    const hasSeen = world.with(uEntity, 'seen')
    if (!hasSeen) return
    const oldPts = [...hasSeen.seen.visible]
    const newSeen = seen([...oldPts, ...newFOV.fov.visible])
    world.updateComponent(hasSeen, newSeen)
  }
}
