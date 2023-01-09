import { World } from '../Core/World'
import { seen, fov } from '../Component'
import { Pt } from '../Model/Point'
import * as ROT from 'rot-js'

export const processFOV = (world: World) => {
  // ! currently updating all entities' fov each turn
  const entities = world.get('fov', 'position')
  if (!entities) return
  let didSomething = false
  for (const entity of entities) {
    const fovFunction = new ROT.FOV.RecursiveShadowcasting(world.isTransparent.bind(world))

    const newFOV = fov(entity.fov.radius)
    fovFunction.compute(entity.position.x, entity.position.y, entity.fov.radius, (x, y, _r, isVisible) => {
      if (isVisible) newFOV.fov.visible.push(Pt(x, y).s)
    })

    const uEntity = world.modify(entity).change(newFOV).entity

    // update seen if needed
    const hasSeen = world.with(uEntity, 'seen')
    if (hasSeen) {
      const ptSet = new Set<string>([...hasSeen.seen.visible, ...newFOV.fov.visible])
      const newSeen = seen([...ptSet])
      world.modify(uEntity).change(newSeen)
    }

    didSomething = true
  }

  if (didSomething) console.log('processFOV: done')
  else console.warn('processFOV: no FOV to process?')
}
