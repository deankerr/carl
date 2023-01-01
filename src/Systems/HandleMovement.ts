// temp: should be unified with npc actions

import { ActionTypes } from '../Actions'
import { World } from '../World'
import { position } from '../Components'
import { TerrainDictionary } from '../Terrain'

export function handleMovement(world: World, action: ActionTypes) {
  if (!action) {
    console.warn('Move: null action')
    return
  }

  if (action.move) {
    const [entity] = world.get('position', 'tagCurrentTurn')
    console.log('HandleMovement:', entity, action.move)
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
      console.log('bump')
    }
  } else {
    console.log('Move: unknown action:', action)
  }
}
