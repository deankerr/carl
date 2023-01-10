import { World } from '../Core/World'
import { fov } from '../Component'
import { Pt } from '../Model/Point'
import * as ROT from 'rot-js'

export const processFOV = (world: World) => {
  // ! currently updating all entities' fov each turn
  const entities = world.get('fov', 'position')
  if (!entities) return
  for (const entity of entities) {
    const fovFunction = new ROT.FOV.RecursiveShadowcasting(world.isTransparent.bind(world))

    const newFOV = fov(entity.fov.radius)
    fovFunction.compute(entity.position.x, entity.position.y, entity.fov.radius, (x, y, _r, isVisible) => {
      if (isVisible) newFOV.fov.visible.push(Pt(x, y).s)
    })
    world.modify(entity).change(newFOV).entity

    // player specific - update area seen memory
    if ('tagPlayer' in entity) {
      const ptSet = new Set<string>([...world.state.level.playerMemory, ...newFOV.fov.visible])
      world.state.level.playerMemory = [...ptSet]
    }
  }

  console.log('processFOV: done')
}
