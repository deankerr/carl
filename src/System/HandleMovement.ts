// temp: should be unified with npc actions

import { ActionTypes } from '../Action'
import { World } from '../Core/World'
import { position } from '../Core/Components'
import { TerrainDictionary } from '../Core/Terrain'

export function handleMovement(world: World, action: ActionTypes) {
  if (!action) {
    console.warn('Move: null action')
    return
  }

  if ('move' in action) {
    const [entity] = world.get('position', 'tagCurrentTurn')
    console.log('Move:', entity, action.move)
    const { position: oldPosition } = entity

    const newX = oldPosition.x + action.move.dx
    const newY = oldPosition.y + action.move.dy

    const terrain = world.current.level.terrain.get(newX, newY) ?? 1

    // terrain walkable check
    // ? handle outcomes like 'bump'?
    if (TerrainDictionary[terrain].walkable) {
      const newPosition = position(newX, newY)
      world.updateComponent(entity, newPosition)
    } else {
      console.log('Move: BUMP!')
    }
  } else {
    console.log('Move: not a move action', action)
  }
}
