// temp: should be unified with npc actions

import { ActionTypes } from '../Action'
import { World } from '../Core/World'
import { position } from '../Core/Components'
import { TerrainDictionary } from '../Core/Terrain'
import { strCmp } from '../util/util'
import { Pt } from '../Model/Point'

export function handleMovement(world: World, action: ActionTypes) {
  if (!action) {
    console.warn('Move: null action')
    return
  }

  if ('move' in action) {
    const [entity] = world.get('position', 'tagCurrentTurn')
    console.log('Move:', entity, action.move)
    const { position: oldPosition } = entity
    const allEntities = world.get('position')

    const newX = oldPosition.x + action.move.dx
    const newY = oldPosition.y + action.move.dy

    const terrain = world.current.level.terrain.get(newX, newY) ?? 1

    // terrain walkable check
    // ? handle outcomes like 'bump'?
    if (!TerrainDictionary[terrain].walkable) {
      console.log('Move: Terrain BUMP!')
      return
    }

    // entity blocking check
    // TODO ignore walkable entities
    // ? probably should be a World method
    const entityHere = allEntities.some((e) => {
      if (e.id === entity.id) return false
      return strCmp(e.position, Pt(newX, newY))
    })

    if (entityHere) {
      console.log('Move: Entity BUMP!')
      return
    }

    // update position
    const newPosition = position(newX, newY)
    world.updateComponent(entity, newPosition)
  } else {
    console.log('Move: not a move action', action)
  }
}
