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

    // player specific
    if ('tagPlayer' in entity) {
      // update level memory
      const memorySet = new Set<string>([...world.state.level.playerMemory, ...newFOV.fov.visible])
      world.state.level.playerMemory = [...memorySet]

      // see through everything to reveal void decor
      const voidFunction = new ROT.FOV.RecursiveShadowcasting(() => true)
      const newVoidPts: string[] = []
      voidFunction.compute(entity.position.x, entity.position.y, entity.fov.radius, (x, y, _r, isVisible) => {
        if (isVisible) newVoidPts.push(Pt(x, y).s)
      })
      const voidSet = new Set<string>([...world.state.level.playerVoidMemory, ...newVoidPts])
      world.state.level.playerVoidMemory = [...voidSet]
    }
  }

  console.log('processFOV: done')
}
