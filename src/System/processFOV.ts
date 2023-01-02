import { World } from '../Core/World'
import { fov, seen } from '../Core/Components'
import { PtS } from '../Model/Point'
import * as ROT from 'rot-js'

export const processFOV = (world: World) => {
  // ! currently updating all entities' fov each turn
  const entities = world.get('fov', 'position')
  if (!entities) return
  let didSomething = false
  for (const entity of entities) {
    const level = world.current.level
    const fovFunction = new ROT.FOV.RecursiveShadowcasting(level.isTransparent.bind(level))

    const newFOV = fov(entity.fov.radius)
    fovFunction.compute(entity.position.x, entity.position.y, entity.fov.radius, (x, y, _r, isVisible) => {
      if (isVisible) newFOV.fov.visible.push(PtS(x, y))
    })

    const uEntity = world.updateComponent(entity, newFOV)

    // update seen if needed
    const hasSeen = world.with(uEntity, 'seen')
    if (hasSeen) {
      const ptSet = new Set<string>([...hasSeen.seen.visible, ...newFOV.fov.visible])
      const newSeen = seen([...ptSet])
      world.updateComponent(hasSeen, newSeen)
    }

    didSomething = true
  }

  if (didSomething) console.log('processFOV: done')
  else console.warn('processFOV: no FOV to process?')
}
